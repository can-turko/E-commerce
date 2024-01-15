import { FormControl, ValidationErrors } from "@angular/forms";

export class CValidator {
    public static notOnlyWhitespace(control:FormControl):ValidationErrors{
        if(control != null  && control.value.trim().length === 0){
            return {'notOnlyWhitespace' : true};
        }
        return {};
    }
}
