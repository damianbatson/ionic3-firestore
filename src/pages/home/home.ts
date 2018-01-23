import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Items {
	description: string;
	itemid: string;
}

interface User {
  uid: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	itemsCollection: AngularFirestoreCollection<Items>; //Firestore collection
  items: Observable<Items[]>; // read collection
  
  userdoc: AngularFirestoreDocument<User>;
  user: Observable<User[]>;

  constructor(
    public navCtrl: NavController, 
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ionViewWillEnter() {
    // var id = this.afAuth.auth.currentUser;
    const userId = this.afAuth.auth.currentUser.uid;
    // if (auth == auth){
    this.itemsCollection = 	this.afs
    .collection(`items`, ref => ref
    .where('users.${userId}', '==', true))
    .doc(userId)
    .collection(`items`); //ref()
    // this.itemsCollection = this.afs.collection('items', ref => ref.where('itemid', '==', 'itemid'));
    this.items = this.itemsCollection.valueChanges();
    // this.afAuth.authState.subscribe((auth) => console.log(auth.uid, this.items));
    // }
  }

  addItem(description: string, itemid: string){
    var auth = this.afAuth.auth.currentUser.uid;
  	this.afs.collection(`items`).doc(auth).collection(`items`).add({
      'description': this.description, 'itemid': this.itemid
    })
      .then( (result) => {
        console.log("Document added with id >>> ", result.id);
      })
      .catch( (error) => {
        console.error("Error adding document: ", error);
      });
  }

  signout(){
    this.afAuth.auth.signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

}
