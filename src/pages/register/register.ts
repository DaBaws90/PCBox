import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  myForm: FormGroup;
  test = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProv:AuthenticationProvider,
    public formB: FormBuilder) {
      // Build the form with some validators, including the custom abstract control validator for password matching
      this.myForm = this.formB.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        password_confirmation: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, {
        validator: this.samePass
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  // Manages the register HTTP Request call
  private signUp() {
    // Calls the AuthProvider's method to manage the register request
    this.authProv.register(this.myForm.value).then((data) => {
      // Check the response to determine if is an error or a success 
      if (data['name'] === "HttpErrorResponse") {
        console.error("There was an error");
      }
      else {
        console.log("REDIRECTING BACK to ROOT PAGE");
        this.navCtrl.popToRoot()
      }
    })
  }

  // Handles the matching for both password and password_confirmation form fields
  private samePass(absCtrl: AbstractControl) {
    // Retrieves both values from HTML form
    const password = absCtrl.get('password').value;
    const password_confirmation = absCtrl.get('password_confirmation').value;
    
    // Set errors if both passwords don't match
    if(password != password_confirmation) {
      absCtrl.get('password_confirmation').setErrors( { samePass: true } )
    } 
    else {
      // Set no errors if passwords match
      absCtrl.get('password_confirmation').setErrors(null);
    }
  }

}
