import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instantFormatter'
})
export class InstantFormatterPipe implements PipeTransform {

  transform(instant: string): string {
    const instantParts: Array<string> = instant.split('T');
    const timeParts: Array<string> = instantParts[1].split(':')
    return instantParts[0] + ' ' + timeParts[0] + ':' + timeParts[1];
  }
}
