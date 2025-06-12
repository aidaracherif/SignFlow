import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,

  } from '@angular/forms';
 
  
  export class CustomValidators {
    static passwordStrength(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        let hasUppercase,
          hasLowercase,
          hasDigit,
          hasSpecialCharacter = false;
        const password = control.value as string;
  
        hasUppercase = /[A-Z]/.test(password);
        hasLowercase = /[a-z]/.test(password);
        hasDigit = /[0-9]/.test(password);
        hasSpecialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(
          password
        );
  
        if (hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter) {
          return null;
        }
  
        return { passwordStrength: true };
      };
    }
    
    static confirmPasswordValidator(): ValidatorFn {
        return (control: AbstractControl
      ): ValidationErrors | null => {
        const passwordValue = control.get("password")?.value

        const confirmPasswordValue = control.get("newpassword")?.value
        if (passwordValue === confirmPasswordValue)

        return null;


        return { passwordNoMatch: true };
      };
    }
  }
  