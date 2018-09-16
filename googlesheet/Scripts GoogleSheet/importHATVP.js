/**
* Imports JSON data to your spreadsheet Ex: IMPORTJSON("http://myapisite.com","city/population")
* @param url URL of your JSON data as string
* @param xpath simplified xpath as string
* @customfunction
*/
function MyFunc () {
  var res = tableauHATVP("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json","01-07-2017","31-12-2017");
  //var res = testImport();
  Logger.log(res);
  Logger.log(res.length);
}

function visuListes() {
  listeDecisionsConcernees("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json",["01-07-2017","31-12-2017"]);
  listeResponsablesPublics("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json",["01-07-2017","31-12-2017"]);
  listeActionsMenees("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json",["01-07-2017","31-12-2017"]);
  listeDomainesIntervention("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json",["01-07-2017","31-12-2017"]);
}

function testImport() {
  var res = importBrutHATVP("https://www.hatvp.fr/agora/opendata/agora_repertoire_opendata.json");
  Logger.log(res);
}

function listeResponsablesPublics(url,periode) {
  var publications = importBrutHATVP(url);
  var publicationsActives = extraitInactifs(publications,periode);
  var listResponsables = [];
  var debut = periode[0];
  var fin = periode[1];
  //listes suivantes définies en testant la fonction listeResponsablesPublics, ces listes permettent de traiter les cas de déclarations mal remplies...
  var ministeres = ["Premier ministre",
                    "Economie et finances",
                    "Environnement, énergie et mer",
                    "Affaires sociales et santé",
                    "Education nationale, enseignement supérieur et recherche",
                    "Ville, jeunesse et sport",
                    "Aménagement du territoire, ruralité et collectivités territoriales",
                    "Logement",
                    "Justice",
                    "Défense"];
  var autoritesIndep = ["Autorité de régulation des activités ferroviaires et routières",
                        "Autorité des marchés financiers",
                        "Haut Conseil du commissariat aux comptes"];

  
  for (var key in publicationsActives) {
    var jsonPub = publicationsActives[key];
    var exercices = jsonPub.exercices;
    var publiCourante;
   for (var cleExo in exercices) {
      if ((exercices[cleExo].publicationCourante) && (exercices[cleExo].publicationCourante.dateFin == fin) && (exercices[cleExo].publicationCourante.dateDebut == debut)) 
      {
          publiCourante = exercices[cleExo].publicationCourante;
      };
    }
    var activites = (publiCourante.activites != undefined) ? publiCourante.activites : [];
    for (var cleA in activites) {
      var actionsRI = activites[cleA].publicationCourante.actionsRepresentationInteret;
    
      for (var cleActions in actionsRI) {
      var resPublic = actionsRI[cleActions].reponsablesPublics;
      for (var cleR in resPublic) {
        var tabResPub = resPublic[cleR].split(" - ");
        var resPubGene = tabResPub[0];
        var end = resPubGene.length - 1;
        if (resPubGene[end] === " ") {resPubGene = resPubGene.substr(0, end)};
        if (inArray(resPubGene,ministeres)) {resPubGene = "Membre du Gouvernement ou membre de cabinet ministériel";}
        if (inArray(resPubGene,autoritesIndep)) {resPubGene = "Directeur ou secrétaire général, ou leur adjoint, ou membre du collège ou d'une commission des sanctions d'une autorité administrative ou publique indépendante";}
        var resPubDetail = tabResPub[1];
        if (!inArray(resPubGene,listResponsables)) {listResponsables.push(resPubGene)};
      }
    }
   }
  }
  Logger.log(listResponsables);
  Logger.log(listResponsables.length);
}

function listeDomainesIntervention(url,periode) {
var publications = importBrutHATVP(url);
  var publicationsActives = extraitInactifs(publications,periode);
  var listDomaines = [];
  var debut = periode[0];
  var fin = periode[1];
  for (var key in publicationsActives) {
    var jsonPub = publicationsActives[key];
    var exercices = jsonPub.exercices;
    var publiCourante;
    for (var cleExo in exercices) {
      if ((exercices[cleExo].publicationCourante) && (exercices[cleExo].publicationCourante.dateFin == fin) && (exercices[cleExo].publicationCourante.dateDebut == debut)) 
      {
          publiCourante = exercices[cleExo].publicationCourante;
      };
    }
    var activites = (publiCourante.activites != undefined) ? publiCourante.activites : [];
    for (var cleA in activites) {
      var domainesInter = activites[cleA].publicationCourante.domainesIntervention;    
      for (var cleD in domainesInter) {     
        if (!inArray(domainesInter[cleD],listDomaines)) {listDomaines.push(domainesInter[cleD])};
    }
   }
  }  
  Logger.log(listDomaines);
  Logger.log(listDomaines.length);
}

function listeActionsMenees(url,periode) {
  var publications = importBrutHATVP(url);
  var publicationsActives = extraitInactifs(publications,periode);
  var listActions = [];
  var debut = periode[0];
  var fin = periode[1];
  for (var key in publicationsActives) {
    var jsonPub = publicationsActives[key];
    var exercices = jsonPub.exercices;
    var publiCourante;
    for (var cleExo in exercices) {
      if ((exercices[cleExo].publicationCourante) && (exercices[cleExo].publicationCourante.dateFin == fin) && (exercices[cleExo].publicationCourante.dateDebut == debut)) 
      {
          publiCourante = exercices[cleExo].publicationCourante;
      };
    }
    var activites = (publiCourante.activites != undefined) ? publiCourante.activites : [];
    for (var cleA in activites) {
      var actionsRI = activites[cleA].publicationCourante.actionsRepresentationInteret;
    
      for (var cleActions in actionsRI) {
      var actions = actionsRI[cleActions].actionsMenees;
      for (var cleA in actions) {
        if (!inArray(actions[cleA],listActions)) {listActions.push(actions[cleA])};
      }
    }
   }
  }  
  Logger.log(listActions);
  Logger.log(listActions.length);
}

function listeDecisionsConcernees(url,periode) {
  var publications = importBrutHATVP(url);
  var publicationsActives = extraitInactifs(publications,periode);
  var listDecisions = [];
  var debut = periode[0];
  var fin = periode[1];
  for (var key in publicationsActives) {
    var jsonPub = publicationsActives[key];
    var exercices = jsonPub.exercices;
    var publiCourante;
    for (var cleExo in exercices) {
      if ((exercices[cleExo].publicationCourante) && (exercices[cleExo].publicationCourante.dateFin == fin) && (exercices[cleExo].publicationCourante.dateDebut == debut)) 
      {
          publiCourante = exercices[cleExo].publicationCourante;
      };
    }
    var activites = (publiCourante.activites != undefined) ? publiCourante.activites : [];
    for (var cleA in activites) {
      var actionsRI = activites[cleA].publicationCourante.actionsRepresentationInteret;
    
      for (var cleActions in actionsRI) {
      var deciCons = actionsRI[cleActions].decisionsConcernees;
      for (var cleD in deciCons) {
        if (!inArray(deciCons[cleD],listDecisions)) {listDecisions.push(deciCons[cleD])};
      }
    }
   }
  }  
  Logger.log(listDecisions);
  Logger.log(listDecisions.length);
}


//import données HATVP : retourne le tableau des publications
function importBrutHATVP(url) {  
   try{
    var res = UrlFetchApp.fetch(url);
    var content = res.getContentText();
    var jsonbrut = JSON.parse(content);
    var pubs = jsonbrut["publications"];
    //Logger.log(pubs);
    return pubs;
    }  
  catch(err){
      return "Error getting data";  
  }
}


//extrait les lobbys inactifs du tableau des publications pour une periode donnée
// @param brut = tableau de json des lobbys provenant directement de la HATVP (jsonHATVP["publications"])
// @param periode = [date debut, ,date fin] les dates étant des strings format HATVP : "31-12-2017"
//retourne un tableau [{publi lobby1}
function extraitInactifs(brut,periode) {
  var debut = periode[0];
  var fin = periode[1];
  var result = [];
  for (var k=0;k<brut.length;k++) {
    for (var cle in brut[k]["exercices"]) {
      //Logger.log(brut[k]["exercices"]);    
		if ((brut[k]["exercices"][cle].publicationCourante) && (brut[k].exercices[cle].publicationCourante.dateFin == fin) && (brut[k].exercices[cle].publicationCourante.dateDebut == debut)) {
          result.push(brut[k]);
		}
	}
  }
 // Logger.log(result);
  return result;
}

function nomLobby(brut) {
  var nomUsage;
	if (brut ['nomUsage'] && (brut['nomUsage'] != ""))
		{ nomUsage = brut ['nomUsage'];}
	else {nomUsage = brut ['denomination'];};
  return nomUsage;
}

// extrait le minimum du string de la fourchette de Chiffre d'Affaire
function numCAmin(str) {
  var CAmin;
  switch (str) {
	case "< 100 000 euros" : CAmin = 0; break;
    case "> = 100 000 euros et < 500 000 euros" : CAmin = 100000; break;  
    case "> = 500 000 euros et < 1 000 000 euros" : CAmin = 500000; break;
    case "> = 1 000 000 euros" : CAmin = 1000000; break;
    default : return "CA Indéterminé";
  }
  return CAmin;
}

// extrait le maximum du string de la fourchette de Chiffre d'Affaire
function numCAmax(str) {
  var CAmax;
  switch (str) {
	case "< 100 000 euros" : CAmax = 100000; break;
    case "> = 100 000 euros et < 500 000 euros" : CAmax = 500000; break;  
    case "> = 500 000 euros et < 1 000 000 euros" : CAmax = 1000000; break;
    case "> = 1 000 000 euros" : CAmax = ""; break;
    default : return "CA Indéterminé";
  }
  return CAmax;
}

// à partir du string fourchette de dépense, retourne un json {min : valeur, max : valeur}
function montantDep(str) {
  var depJson = {};
		switch (str) {
          case "< 10 000 euros" : depJson = {"min" : 0, "max" : 10000};
								break;
		case "> = 10 000 euros et < 25 000 euros" : depJson = {"min" : 10000, "max" : 25000};
								break;							
		case "> = 25 000 euros et < 50 000 euros" : depJson = {"min" : 25000, "max" : 50000};
								break;	
		case "> = 50 000 euros et < 75 000 euros" : depJson = {"min" : 50000, "max" : 75000};
								break;	
		case "> = 75 000 euros et < 100 000 euros" : depJson = {"min" : 75000, "max" : 100000};
								break;									
		case "> = 100 000 euros et < 200 000 euros" : depJson = {"min" : 100000, "max" : 200000};
								break;												
		case "> = 200 000 euros et < 300 000 euros" : depJson = {"min" : 200000, "max" : 300000};
								break;
		case "> = 300 000 euros et < 400 000 euros" : depJson = {"min" : 300000, "max" : 400000};
								break;
		case "> = 400 000 euros et < 500 000 euros" : depJson = {"min" : 400000, "max" : 500000};
								break;					
		case "> = 500 000 euros et < 600 000 euros" : depJson = {"min" : 500000, "max" : 600000};
								break;
		case "> = 600 000 euros et < 700 000 euros" : depJson = {"min" : 600000, "max" : 700000};
								break;		
		case "> = 700 000 euros et < 800 000 euros" : depJson = {"min" : 700000, "max" : 800000};
								break;	
		case "> = 800 000 euros et < 900 000 euros" : depJson = {"min" : 800000, "max" : 900000};
								break;	
		case "> = 900 000 euros et < 1 000 000 euros" : depJson = {"min" : 900000, "max" : 1000000};
								break;	
		case "> = 1 000 000 euros et < 1 250 000 euros" : depJson = {"min" : 1000000, "max" : 1250000};
								break;	
		case "> = 1 250 000 euros et < 1 500 000 euros" : depJson = {"min" : 1250000, "max" : 1500000};
								break;
		case "> = 1 500 000 euros et < 1 750 000 euros" : depJson = {"min" : 1500000, "max" : 1750000};
								break;	
		case "> = 1 750 000 euros et < 2 000 000 euros" : depJson = {"min" : 1750000, "max" : 2000000};
								break;
		case "> = 2 000 000 euros et < 2 250 000 euros" : depJson = {"min" : 2000000, "max" : 2250000};
								break;	
		case "> = 2 250 000 euros et < 2 500 000 euros" : depJson = {"min" : 2250000, "max" : 2500000};
								break;
		case "> = 2 500 000 euros et < 2 750 000 euros" : depJson = {"min" : 2500000, "max" : 2750000};
								break;	
		case "> = 2 750 000 euros et < 3 000 000 euros" : depJson = {"min" : 2750000, "max" : 3000000};
								break;
		case "> = 3 000 000 euros et < 3 250 000 euros" : depJson = {"min" : 3000000, "max" : 3250000};
								break;	
		case "> = 3 250 000 euros et < 3 500 000 euros" : depJson = {"min" : 3250000, "max" : 3500000};
								break;
		case "> = 3 500 000 euros et < 3 750 000 euros" : depJson = {"min" : 3500000, "max" : 3750000};
								break;	
		case "> = 3 750 000 euros et < 4 000 000 euros" : depJson = {"min" : 3750000, "max" : 4000000};
								break;
		case "> = 4 000 000 euros et < 4 250 000 euros" : depJson = {"min" : 4000000, "max" : 4250000};
								break;	
		case "> = 4 250 000 euros et < 4 500 000 euros" : depJson = {"min" : 4250000, "max" : 4500000};
								break;
		case "> = 4 500 000 euros et < 4 750 000 euros" : depJson = {"min" : 4500000, "max" : 4750000};
								break;	
		case "> = 4 750 000 euros et < 5 000 000 euros" : depJson = {"min" : 4750000, "max" : 5000000};
								break;
		case "> = 5 000 000 euros et < 5 250 000 euros" : depJson = {"min" : 5000000, "max" : 5250000};
								break;	
		case "> = 5 250 000 euros et < 5 500 000 euros" : depJson = {"min" : 5250000, "max" : 5500000};
								break;
		case "> = 5 500 000 euros et < 5 750 000 euros" : depJson = {"min" : 5500000, "max" : 5750000};
								break;	
		case "> = 5 750 000 euros et < 6 000 000 euros" : depJson = {"min" : 5750000, "max" : 6000000};
								break;
		case "> = 6 000 000 euros et < 6 250 000 euros" : depJson = {"min" : 6000000, "max" : 6250000};
								break;	
		case "> = 6 250 000 euros et < 6 500 000 euros" : depJson = {"min" : 6250000, "max" : 6500000};
								break;
		case "> = 6 500 000 euros et < 6 750 000 euros" : depJson = {"min" : 6500000, "max" : 6750000};
								break;	
		case "> = 6 750 000 euros et < 7 000 000 euros" : depJson = {"min" : 6750000, "max" : 7000000};
								break;
		case "> = 7 000 000 euros et < 7 250 000 euros" : depJson = {"min" : 7000000, "max" : 7250000};
								break;	
		case "> = 7 250 000 euros et < 7 500 000 euros" : depJson = {"min" : 7250000, "max" : 7500000};
								break;
		case "> = 7 500 000 euros et < 7 750 000 euros" : depJson = {"min" : 7500000, "max" : 7750000};
								break;	
		case "> = 7 750 000 euros et < 8 000 000 euros" : depJson = {"min" : 7750000, "max" : 8000000};
								break;
		case "> = 8 000 000 euros et < 8 250 000 euros" : depJson = {"min" : 8000000, "max" : 8250000};
								break;	
		case "> = 8 250 000 euros et < 8 500 000 euros" : depJson = {"min" : 8250000, "max" : 8500000};
								break;
		case "> = 8 500 000 euros et < 8 750 000 euros" : depJson = {"min" : 8500000, "max" : 8750000};
								break;	
		case "> = 8 750 000 euros et < 9 000 000 euros" : depJson = {"min" : 8750000, "max" : 9000000};
								break;
		case "> = 9 000 000 euros et < 9 250 000 euros" : depJson = {"min" : 9000000, "max" : 9250000};
								break;	
		case "> = 9 250 000 euros et < 9 500 000 euros" : depJson = {"min" : 9250000, "max" : 9500000};
								break;
		case "> = 9 500 000 euros et < 9 750 000 euros" : depJson = {"min" : 9500000, "max" : 9750000};
								break;	
		case "> = 9 750 000 euros et < 10 000 000 euros" : depJson = {"min" : 9750000, "max" : 10000000};
								break;
		case "> = 10 000 000 euros" : depJson = {"min" : 10000000, "max" : 15000000};
								break;					
		default : depJson = depJson = {"min" : 1, "max" : 1};	
		}
		return depJson;
}

// test de presence de l'element needle dans le tableau array
function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

// calcul du nombre d'entites representées par le lobby dans ses activités
function nombreTiers (actis,nomLobby) {
  var tiers = [];
  for (var key in actis) {
    var actionsRI = actis[key].publicationCourante.actionsRepresentationInteret;
    for (var cle in actionsRI) {
      var tiersCourant = actionsRI[cle].tiers;
      if (tiersCourant != undefined) {
        for (var k in tiersCourant) {
          if (!inArray(tiersCourant[k],tiers)) {
            tiers.push(tiersCourant[k]);
          }
        }
      }
    }
  }
  return tiers.length;
}

function compteurActionsMenees(actis) {
  var listeActionsMenees = ["Organiser des discussions informelles ou des réunions en tête-à-tête",
                            "Transmettre aux décideurs publics des informations, expertises dans un objectif de conviction",
                            "Transmettre des suggestions afin d'influencer la rédaction d'une décision publique",
                            "Etablir une correspondance régulière (par courriel, par courrier…)",
                            "Organiser des débats publics, des marches, des stratégies d'influence sur internet",
                            "Envoyer des pétitions, lettres ouvertes, tracts",
                            "Autres : à préciser",
                            "Inviter ou organiser des évènements, des rencontres ou des activités promotionnelles",
                            "Convenir pour un tiers d'une entrevue avec le titulaire d'une charge publique",
                            "Organiser des auditions, des consultations formelles sur des actes législatifs ou d'autres consultations ouvertes"];
  
  var compteurActions = {};
  for (var key in listeActionsMenees) {
    compteurActions[listeActionsMenees[key]] = 0;
  }
  for (var cle in actis) {
    var actionsRI = actis[cle].publicationCourante.actionsRepresentationInteret;
    for (var k in actionsRI) {
      var tabActions = actionsRI[k].actionsMenees;
      for (var i in tabActions) {
        compteurActions[tabActions[i]] = compteurActions[tabActions[i]] + 1;
      }
    }
  }
  return compteurActions;
}



function compteurDecisionsConcernees(actis) {
  var listeDecConcern = ["Lois, y compris constitutionnelles",
                         "Actes réglementaires", 
                         "Ordonnances de l'article 38 de la Constitution",
                         "Autres décisions publiques",
                         "Décisions d'espèce",
                         "Marchés publics d'une valeur supérieure aux seuils européens",
                         "Contrats de concession d'une valeur supérieure aux seuils européens",
                         "Contrats de cession d'un bien du domaine privé de l'État ou de ses établissements publics",
                         "Baux emphytéotiques administratifs",
                         "Contrats valant autorisation temporaire d'occupation du domaine public",
                         "Délibérations approuvant la constitution d’une société d’économie mixte"];

  var compteurDecisions = {};
  for (var key in listeDecConcern) {
    compteurDecisions[listeDecConcern[key]] = 0;
  }
  for (var cle in actis) {
    var actionsRI = actis[cle].publicationCourante.actionsRepresentationInteret;
    for (var k in actionsRI) {
      var tabDecisions = actionsRI[k].decisionsConcernees;
      for (var i in tabDecisions) {
        compteurDecisions[tabDecisions[i]] = compteurDecisions[tabDecisions[i]] + 1;
      }
    }
  }
  return compteurDecisions;
}

function compteurResponsablesPublics(activites) {
  var listeResponsablesPublics = ["Député ; sénateur ; collaborateur parlementaire ou agents des services des assemblées parlementaires",
                                  "Membre du Gouvernement ou membre de cabinet ministériel",
                                  "Directeur ou secrétaire général, ou leur adjoint, ou membre du collège ou d'une commission des sanctions d'une autorité administrative ou publique indépendante",
                                  "Collaborateur du Président de la République",
                                  "Titulaire d'un emploi à la décision du Gouvernement"];
  //listes suivantes définies en utilisant la fonction listeResponsablesPublics qui permet de repérer et traiter les cas de déclarations mal remplies...
  var ministeres = ["Premier ministre",
                    "Economie et finances",
                    "Environnement, énergie et mer",
                    "Affaires sociales et santé",
                    "Education nationale, enseignement supérieur et recherche",
                    "Ville, jeunesse et sport",
                    "Aménagement du territoire, ruralité et collectivités territoriales",
                    "Logement",
                    "Justice",
                    "Défense"];
  var autoritesIndep = ["Autorité de régulation des activités ferroviaires et routières",
                        "Autorité des marchés financiers",
                        "Haut Conseil du commissariat aux comptes"];
  var compteurResponsables = {};
  for (var key in listeResponsablesPublics) {
    compteurResponsables[listeResponsablesPublics[key]] = 0;
  }
  for (var cleA in activites) {
      var actionsRI = activites[cleA].publicationCourante.actionsRepresentationInteret;   
      for (var cleActions in actionsRI) {
      var resPublic = actionsRI[cleActions].reponsablesPublics;
      for (var cleR in resPublic) {
        var tabResPub = resPublic[cleR].split(" - ");
        var resPubGene = tabResPub[0];
        var end = resPubGene.length - 1;
        if (resPubGene[end] === " ") {resPubGene = resPubGene.substr(0, end)};
        //traitement des cas particuliers mal remplis
        if (inArray(resPubGene,ministeres)) {resPubGene = "Membre du Gouvernement ou membre de cabinet ministériel";}
        if (inArray(resPubGene,autoritesIndep)) {resPubGene = "Directeur ou secrétaire général, ou leur adjoint, ou membre du collège ou d'une commission des sanctions d'une autorité administrative ou publique indépendante";}
        
        compteurResponsables[resPubGene] = compteurResponsables[resPubGene] + 1;      
      }
    }
   }
  return compteurResponsables;
}

//retourne un json {"Aeronautique,aerospatiale" : 0, "Agriculture" : 4, .... } ou les clefs sont les noms des secteurs d'activités (liste des lignes directrices de Janvier 2018 de la HATVP)
function compteurSecteurActiv(actis) {
  var tablSectActivDomInter = {"Aéronautique, aérospatiale" : ["Industrie aéronautique","Industrie aérospatiale"],
                               "Agriculture, agroalimentaire" : ["Agriculture","Développement des territoires","Industrie agroalimentaire","Appellations","Sécurité et normes alimentaires"],
                               "Arts, culture" : ["Musique","Cinéma","Livre","Jeux-vidéo","Patrimoine","Spectacle vivant","Accès à la culture"],
                               "Banques, assurances, secteur financier" : ["Banques","Assurances","Finances"],
                               "Commerce extérieur" : ["Accords internationaux","Taxation"],
                               "Coopération internationale" : ["Aide au développement","Humanitaire"],
                               "Défense, sécurité" : ["Sécurité nationale","Défense","Accidents et catastrophes naturelles","Espionnage et surveillance"],
                               "Economie" : ["Politique industrielle","Marchés réglementés"],
                               "Education, enseignement, formation" : ["Formation professionnelle","Education"],
                               "Emploi, solidarité" : ["Droit du travail","Dialogue social","Assurance chômage","Retraites"],
                               "Energie" : ["Energie nucléaire","Energies fossiles","Energies renouvelables"],
                               "Enseignement supérieur, recherche, innovation" : ["Enseignement supérieur","Recherche et innovation"],
                               "Environnement" : ["Impact de l'activité industrielle","Impact des transports marchands et collectifs","Impact des transports individuels","Qualité de l'eau","Déchets","Dépollution","Produits chimiques","Principe de précaution","Normes de production"],
                               "Finances publiques" : ["Impôts","Taxes","Budget","Statistiques"],
                               "Justice" : ["Institutions judiciaires","Institutions pénitentiaires","Justice pénale","Justice civile","Ordre administratif"],
                               "Construction, Logement, aménagement du territoire" : ["Construction","Logement","Bâtiments et travaux publics","Occupation des sols"],
                               "Médias" : ["Audiovisuel","Presse écrite","Liberté d’expression et d’information","Publicité"],
                               "Numérique" : ["Accès à l’Internet","E-commerce","Marché du numérique","Protection des données"],
                               "Outre-mer" : ["Institutions des outre-mer","Economie des outre-mer","Développement économique des outre-mer"],
                               "Pouvoirs publics et institutions" : ["Fonction publique","Collectivités territoriales","Moralisation/Transparence","Institutions européennes","Partenariats public/privé"],
                               "Propriété intellectuelle" : ["Brevet","Droit d'auteur","Protection des marques","Secret des affaires / Secret professionnel"],
                               "Questions migratoires" : ["Asile","Immigration","Français de l’étranger"],
                               "Ressources naturelles" : ["Pêche","Chasse","Forêt","Ressources minières","Eaux"],
                               "Santé" : ["Système de santé et médico-social","Soins et maladies","Médicaments","Prévention","Remboursements"],
                               "Entreprises et professions libérales" : ["Aides aux entreprises","PME/TPE","Professions réglementées","Droit de la concurrence"],
                               "Société" : ["Laïcité","Egalité femmes/hommes","Egalité des chances","Famille","Discriminations","Handicap","Droits et libertés fondamentales","Droits des victimes","Bien-être animal"],
                               "Sports, loisirs, tourisme" : ["Sports","Jeux d'argent","Tourisme/hôtellerie"],
                               "Télécommunications" : ["Infrastructures de télécommunications","Accès aux moyens de télécommunications"],
                               "Transports, logistique" : ["Transport de voyageurs","Transport de fret","Infrastructures","Sécurité routière","Services postaux","Transports alternatifs"]
                              }
  var compteurSecteur = {};
  for (var key in tablSectActivDomInter) {
    compteurSecteur[key] = 0;
  }
  for (var secteur in tablSectActivDomInter) {
    for (var key in actis) {
      var domInter = actis[key].publicationCourante.domainesIntervention;
      var actiInSecteur = false;
      for (var cle in domInter) {
        if (inArray(domInter[cle],tablSectActivDomInter[secteur])) {
          actiInSecteur = true;          
        }
      }
      if (actiInSecteur) {
          compteurSecteur[secteur] = compteurSecteur[secteur] + 1;
        }
    }    
  }
  return compteurSecteur;
}


//crée un json synthétisant l'activité du lobby dans la période définie par dates
// @param publi : json de la declaration du lobby
// @param dates : [stringdebut, stringfin]
function jsonBilanActivite(publi,dates) {
  var exercices = publi.exercices;
  var publiCourante;
  var debut = dates[0];
  var fin = dates[1];
  for (var cleExo in exercices) {
    if ((exercices[cleExo].publicationCourante) && (exercices[cleExo].publicationCourante.dateFin == fin) && (exercices[cleExo].publicationCourante.dateDebut == debut)) 
    {
          publiCourante = exercices[cleExo].publicationCourante;
    };
  }
  var depense = montantDep(publiCourante.montantDepense);
  var activites = (publiCourante.activites != undefined) ? publiCourante.activites : [];
  var comptSecteurs = compteurSecteurActiv(activites);
  var comptDecis = compteurDecisionsConcernees(activites);
  var comptResponsables = compteurResponsablesPublics(activites);
  var comptActions = compteurActionsMenees(activites);
  var jsonSynthese = {"nom" : nomLobby(publi),
                      "ID" : publi.typeIdentifiantNational+":"+publi.identifiantNational,
                      "presentation" : "",
                      "sources" : "",
                      "categorieOrga" : publi.categorieOrganisation.label,
                      "exerciceDebut" : publiCourante.dateDebut,
                      "exerciceFin" : publiCourante.dateFin,
                      "chiffreAffaireMin" : publiCourante.hasNotChiffreAffaire ? "Pas de CA" : numCAmin(publiCourante.chiffreAffaire),
                      "chiffreAffaireMax" : publiCourante.hasNotChiffreAffaire ? "Pas de CA" : numCAmax(publiCourante.chiffreAffaire),
                      "montantDepenseMin" : depense.min,
                      "montantDepenseMax" : depense.max,
                      "nombreSalaries" : publiCourante.nombreSalaries,
                      "nombreActivites" : activites.length,
                      "nombreEntitesRep" : nombreTiers(activites)
                     };
  for (var sect in comptSecteurs) {
    jsonSynthese[sect] = comptSecteurs[sect];
  }
  for (var decis in comptDecis) {
    jsonSynthese[decis] = comptDecis[decis];
  }
  for (var respons in comptResponsables) {
    jsonSynthese[respons] = comptResponsables[respons];
  }
  for (var actions in comptActions) {
    jsonSynthese[actions] = comptActions[actions];
  }
  return jsonSynthese;
}

function formatLigneLobby(json) {
  var listeColonnesOrdonnees = ["nom",
                                "ID",
                                "presentation",
                                "sources",
                                "categorieOrga",
                                "exerciceDebut",
                                "exerciceFin",
                                "chiffreAffaireMin",
                                "chiffreAffaireMax",
                                "montantDepenseMin",
                                "montantDepenseMax",
                                "nombreSalaries",
                                "nombreActivites",
                                "nombreEntitesRep",
                                "Député ; sénateur ; collaborateur parlementaire ou agents des services des assemblées parlementaires",
                                "Membre du Gouvernement ou membre de cabinet ministériel",
                                "Directeur ou secrétaire général, ou leur adjoint, ou membre du collège ou d'une commission des sanctions d'une autorité administrative ou publique indépendante",
                                "Collaborateur du Président de la République",
                                "Titulaire d'un emploi à la décision du Gouvernement",
                                "Organiser des discussions informelles ou des réunions en tête-à-tête",
                                "Convenir pour un tiers d'une entrevue avec le titulaire d'une charge publique",
                                "Inviter ou organiser des évènements, des rencontres ou des activités promotionnelles",
                                "Etablir une correspondance régulière (par courriel, par courrier…)",
                                "Envoyer des pétitions, lettres ouvertes, tracts",
                                "Organiser des débats publics, des marches, des stratégies d'influence sur internet",
                                "Organiser des auditions, des consultations formelles sur des actes législatifs ou d'autres consultations ouvertes",
                                "Transmettre des suggestions afin d'influencer la rédaction d'une décision publique",
                                "Transmettre aux décideurs publics des informations, expertises dans un objectif de conviction",
                                "Autres : à préciser",
                                "Lois, y compris constitutionnelles",
                                "Ordonnances de l'article 38 de la Constitution",
                                "Actes réglementaires",
                                "Décisions d'espèce",
                                "Marchés publics d'une valeur supérieure aux seuils européens",
                                "Contrats de concession d'une valeur supérieure aux seuils européens",
                                "Contrats valant autorisation temporaire d'occupation du domaine public",                        
                                "Baux emphytéotiques administratifs",
                                "Contrats de cession d'un bien du domaine privé de l'État ou de ses établissements publics",
                                "Délibérations approuvant la constitution d’une société d’économie mixte",
                                "Autres décisions publiques",
                                "Aéronautique, aérospatiale",
                                "Agriculture, agroalimentaire",
                                "Arts, culture",
                                "Banques, assurances, secteur financier",
                                "Commerce extérieur",
                                "Coopération internationale",
                                "Défense, sécurité",
                                "Economie",
                                "Education, enseignement, formation",
                                "Emploi, solidarité",
                                "Energie",
                                "Enseignement supérieur, recherche, innovation",
                                "Environnement",
                                "Finances publiques",
                                "Justice",
                                "Construction, Logement, aménagement du territoire",
                                "Médias",
                                "Numérique",
                                "Outre-mer",
                                "Pouvoirs publics et institutions",
                                "Propriété intellectuelle",
                                "Questions migratoires",
                                "Ressources naturelles",
                                "Santé",
                                "Entreprises et professions libérales",
                                "Société",
                                "Sports, loisirs, tourisme",
                                "Télécommunications",
                                "Transports, logistique"];
  var ligneLobby = [];
  if (typeof(json) === "object") {
    for (var k=0;k<listeColonnesOrdonnees.length;k++) {
      ligneLobby[k] = json[listeColonnesOrdonnees[k]];
    }
  }
  else if (json === "titres") {
    ligneLobby = listeColonnesOrdonnees;
  }
  return ligneLobby;
}

// fonction à inserer en haut à gauche de l'onglet Bilan Activités 
// retourne un tableau [[synthese lobby 1], [synthese lobby 2], ....]
function tableauHATVP (url,debut,fin) {
  var periode = [debut,fin];
  var publications = importBrutHATVP(url);
  var publicationsActives = extraitInactifs(publications,periode);
  var colonnes = [];
  var tableauInserable = [];
  tableauInserable.push(formatLigneLobby("titres"));
  for (var key in publicationsActives) {
    var jsonPub = publicationsActives[key];
    var synthPubli = jsonBilanActivite(jsonPub,periode);
    var ligneFormatee = formatLigneLobby(synthPubli);
    tableauInserable.push(ligneFormatee);
  }  
  return tableauInserable;  
}
/*
function ImportPublicationsHatvp(url) {
   try{
    var res = UrlFetchApp.fetch(url);
    var content = res.getContentText();
    var jsonbrut = JSON.parse(content);
    var publications = jsonbrut["publications"];
    //Logger.log(publications);
    
    var tableau = [];
   //var champs = ["denomination"];
    //tableau.push(champs);
    /*
    for (var key in publications) {
       var tempArr = [];      
      for(var i=0;i<champs.length;i++){
        tempArr.push(publications[key][champs[i]]);
      }
     for (var key in publications) {
       var tempArr = [];
       tempArr.push(publications[key]["denomination"]);
       //Logger.log(tempArr);
       tableau.push(tempArr);
     }
     return tableau;
    //Logger.log(tableau);
   
    }
  catch(err){
      return "Error getting data";  
  }
  
}
  
function ImportJsonHatvp(url,xpath){
  
  try{
    // /rates/EUR
    var res = UrlFetchApp.fetch(url);
    var content = res.getContentText();
    var json = JSON.parse(content);
    var tableau = [];
    //var xpath = "publications/0/denomination";
    var patharray = xpath.split("/");
    //Logger.log(patharray);
    
    for(var i=0;i<patharray.length;i++){
      json = json[patharray[i]];
    }
    
    //Logger.log(json);
    
    if(typeof(json) === "undefined"){
      return "Node Not Available";
    } else if(typeof(json) === "object"){
      var tempArr = [];
      
      for(var obj in json){
        tempArr.push([obj,json[obj]]);
      }
      return tempArr;
    } else if(typeof(json) !== "object") {
      return json;
    }
  }
  catch(err){
      return "Error getting data";  
  }
  
}
*/