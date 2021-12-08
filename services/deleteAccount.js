import firebase from "firebase";

export default function deleteAccount ( onSuccess,onFailure){

    const user = firebase.auth().currentUser;
    user.delete().then(() => {
        if(onSuccess !== undefined){
            onSuccess()
        }
    }).catch((error) => {
        if(onFailure !== undefined){
            onFailure(error)
        }
    });
}