UE Développement mobile
=======================

Projet développé dans le cadre de la formation **M2-GI**


Etudiants: 

* *Fabien Tiret*
* *Etienne Estrangin*

### Consignes de compilation de l'application
+ Récupérer les sources sur le dépôt Github: https://github.com/estrangegitbis/todoList.git
+ Installer les dépendances: `npm install`
+ Installer une plateforme android: `ionic cordova platform add android`
+ Compilation et lancement de l'application: `ionic cordova run android`
+ Pour l'utilisation du plugin geolocation une version de la plateforme adroid avec une version supérieure à 6.3.0 est nécessaire.
Le plugin compat doit également être mis à jour avec une version supérieurs à 1.2.0. Les lignes de commande suivantes sont nécessaires:
  + `ionic cordova plugin rm cordova-plugin-compat --force`
  + `ionic cordova plugin add cordova-plugin-compat@1.2`
  + `ionic cordova platform rm android`
  + `ionic cordova platform add android@6.3.0` 

### Détails des fonctionnalités réalisées
+ Login à l'application par compte Google.
+ L'utilisateur connecté a la possibilité d'accéder aux listes de todo ainsi qu'aux items qui composent ces listes.
+ Les fonctionnalités d'édition, d'ajout et de suppression de listes sont présentes.
+ Une reconnaissance vocale permet la gestion de l'ensemble des listes et des items. Pour cela l'application reconnaît les mots clés *ajouter* et *supprimer* suivi de la liste ou de l'item choisi (exemple: *ajouter liste de courses*).
+ L'application est accessible en mode connecté et en mode déconnecté.
+ Possibilité de partager des listes entre les utilisateurs grâce à leur email

### Détails des spécificités de l'application
+ Les informations sont stockées sur une base de données accessible en ligne au travers du service *firebase*.
+ L'application est conçue pour plusieurs utilisateurs: chaque utilisateur connecté a accès à une liste qui lui ait propre.
+ Le mode déconnecté permet à l'utilisateur de stocker l'ensemble des informations dans une base de données SQlite.
+ Le partage d'une liste donne tous les droits (édition, suppression) à ceux avec lesquels elle est partagée.
