import firebase from "firebase";

firebase
    .database()
    .ref('clinics')
    .push({selectedItems, selectedItems2, cvr, workp, workt, tlf, companyName, contactMail});

firebase
    .database()
    .ref('candidates')
    .push({selectedItemsC, selectedItemsC2, candidateName, cTlf, contactMailC});

setSelectedItemsC([]);
setSelectedItemsC2([]);