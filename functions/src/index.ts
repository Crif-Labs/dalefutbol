/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

import {onDocumentUpdated} from "firebase-functions/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

const isEmulator =
  process.env.FUNCTIONS_EMULATOR === "true" ||
  !!process.env.FIREBASE_EMULATOR_HUB;

export const sendReservaNotification = onDocumentUpdated(
  "perfil/{uid}/reserva/{reservaId}",
  async (event) => {
    const newData = event.data?.after.data();
    const previousData = event.data?.before.data();

    if (!newData || !previousData) return null;

    // Solo reaccionamos si cambió el estado
    if (newData.estado === previousData.estado) return null;

    const userID = newData.userId;
    const perfilSnap = await admin.firestore().doc(`perfil/${userID}`).get();
    const fcmToken = perfilSnap.get("fcmToken");

    if (!fcmToken) {
      console.log("⚠️ Usuario sin token FCM");
      return null;
    }

    const payload = {
      notification: {
        title: "Tu reserva",
        body: `Tu reserva ha sido ${newData.estado}`,
      },
      token: fcmToken,
      data: {
        reservaId: String(event.params.reservaId),
        estado: String(newData.estado),
      }
    };

    if (isEmulator) {
      console.log("🤖 [EMULATOR] Enviaría FCM:", payload);
      return null;
    }

    try {
      await admin.messaging().send(payload);
      console.log("✅ Notificación enviada:", payload);
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }

    return null;
  }
);


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
