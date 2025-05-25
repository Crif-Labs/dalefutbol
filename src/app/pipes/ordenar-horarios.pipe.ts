import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarHorarios'
})
export class OrdenarHorariosPipe implements PipeTransform {

  transform(value: any[], campo: string = 'hora_inicio'): any[] {
    if (!value) return [];

    return value.sort((a, b) => {
      const horaA = this.convertirAHora(a.horario[campo]);
      const horaB = this.convertirAHora(b.horario[campo]);
      return horaA - horaB;
    });
  }

  private convertirAHora(horaStr: string): number {
    // Convierte "13:30" en 1330 para poder comparar
    const [hora, minutos] = horaStr.split(':').map(Number);
    return hora * 60 + minutos;
  }

}
