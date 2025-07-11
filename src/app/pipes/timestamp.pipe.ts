import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: Timestamp | null, format: string = 'default'): string {
    if(!value || !(value instanceof Timestamp)) return '';

    const date = value.toDate()

    switch (format) {
      case 'dia-mes':
        return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long' });
      case 'mes':
        return date.toLocaleDateString('es-CL', { month: 'long' });
      case 'anio':
        return date.toLocaleDateString('es-CL', { year: 'numeric' });
      case 'hora':
        return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      default:
        return date.toLocaleDateString('es-CL'); // "10-07-2025"
    }

    // return date.toLocaleDateString('es-CL')
  }

}
