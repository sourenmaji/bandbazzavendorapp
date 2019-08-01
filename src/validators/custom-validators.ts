import { FormControl, FormGroup } from '@angular/forms';

export class CustomValidator {

  static lte(value1: string, value2: string) {
    return (group: FormGroup) => {
      let x = group.controls[value1];
      let y = group.controls[value2];

      if(+x.value <= +y.value && +y.value && +x.value)
        {
          return x.setErrors({ lte: true });
        }
        else
        {
          return x.setErrors(null);
        }
      }
    }

    static equalTo(value1: string, value2: string) {
      return (group: FormGroup) => {
        let x = group.controls[value1];
        let y = group.controls[value2];
  
        if(x.value !== y.value)
          {
            return y.setErrors({ equalTo: true });
          }
          else
          {
            return y.setErrors(null);
          }
        }
      }

    static validpercent(control: FormControl) {
        if(+control.value > 100)
          {
            return { validpercent: true };
          }
          else
          {
            return null;
          }
        }
  }


