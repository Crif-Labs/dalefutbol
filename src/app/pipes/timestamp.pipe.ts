import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: Timestamp | null, format: string = 'dd/MM/yyyy'): string {
    if(!value || !(value instanceof Timestamp)) return '';

    const date = value.toDate()
    return date.toLocaleDateString('es-CL')
  }

}
