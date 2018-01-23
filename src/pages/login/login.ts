import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
 
    
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1}) 
        ]))
      ])
    ]),
 
    
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ] //end animations
})
export class LoginPage {

  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";

  loginData = {
    email: '',
    password: ''
  }
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private facebook: Facebook,
    private platform: Platform
  ) { }

  async login() {
    await this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
        // Do custom things with auth
      })
      .catch(err => {
        // Handle error
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      });
  }

  async signup() {
    await this.navCtrl.push(RegisterPage, { email: this.loginData.email });
  }

  async loginFacebook() {
    if (this.platform.is('cordova')) {
      const result = await this.facebook.login(['email', 'public_profile']);
      // .then(res => {
        const facebookCredential = await firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
        await firebase.auth().signInWithCredential(facebookCredential);
      // })
    }
    else {
      const provider = new firebase.auth.FacebookAuthProvider();
      await this.afAuth.auth.signInWithPopup(provider)
        .then(res => console.log(res));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
