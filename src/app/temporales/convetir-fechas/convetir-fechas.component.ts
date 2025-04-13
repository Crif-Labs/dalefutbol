import { Component, OnInit } from '@angular/core';
import { Firestore, collectionGroup, getDocs, updateDoc, doc, Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-convetir-fechas',
  imports: [],
  templateUrl: './convetir-fechas.component.html',
  styleUrl: './convetir-fechas.component.scss'
})
export class ConvetirFechasComponent implements OnInit{

  constructor(private firestore: Firestore){}

  async ngOnInit() {
    try {
      const reservasRef = collectionGroup(this.firestore, 'reserva'); // Busca todas las subcolecciones llamadas "reserva"
      const snapshot = await getDocs(reservasRef);
      let actualizadas = 0;
      let yaEstaban = 0;

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const ref = docSnap.ref;

        const fechaReserva = data['fecha_reserva'];

        if (typeof fechaReserva === 'string') {
          const fechaDate = new Date(fechaReserva);

          if (!isNaN(fechaDate.getTime())) {
            await updateDoc(ref, {
              fecha_reserva: Timestamp.fromDate(fechaDate),
            });
            actualizadas++;
            console.log(`✅ Actualizada reserva ${docSnap.id}`);
          } else {
            console.warn(`❌ Fecha inválida en reserva ${docSnap.id}:`, fechaReserva);
          }
        } else if (fechaReserva instanceof Timestamp) {
          yaEstaban++;
        }
      }

      console.log(`✔️ Reservas actualizadas: ${actualizadas}`);
      console.log(`✔️ Reservas ya eran Timestamp: ${yaEstaban}`);
    } catch (error) {
      console.error('❌ Error actualizando reservas:', error);
    }
  }
  
}
