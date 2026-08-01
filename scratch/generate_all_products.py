# Python script to build the complete TS file for ALL catalog products
import json

raw_catalog_data = [
  # PAGE 3 - STANDARDS & DOUBLE PRÉNOM (001 - 009)
  (1, "001", "Collier Prénom Classique 'Kimberly'", 7000, "colliers-femme", "femme", "Standards & Double prénom"),
  (2, "002", "Collier Double Prénom & Infini 'R & P'", 9000, "colliers-femme", "femme", "Standards & Double prénom"),
  (3, "003", "Collier Cœur Ajouré 'Michael'", 8500, "colliers-femme", "femme", "Standards & Double prénom"),
  (4, "004", "Collier Papillon Suspense 'Altra'", 10000, "colliers-femme", "femme", "Standards & Double prénom"),
  (5, "005", "Collier Étoile & Papillon 'Mailys'", 10000, "colliers-femme", "femme", "Standards & Double prénom"),
  (6, "006", "Collier Couronne Royale 'Sharon'", 10500, "colliers-femme", "femme", "Standards & Double prénom"),
  (7, "007", "Collier Double Prénom 'Shawn Mendes'", 10500, "colliers-femme", "femme", "Standards & Double prénom"),
  (8, "008", "Collier Signature Couronne 'Mithila'", 9500, "colliers-femme", "femme", "Standards & Double prénom"),
  (9, "009", "Collier Papillons Entrelacés 'Aliyah'", 10000, "colliers-femme", "femme", "Standards & Double prénom"),

  # PAGE 4 - STANDARDS & DOUBLE PRÉNOM (010 - 019)
  (10, "010", "Collier Cœurs & Double Prénom 'Nixon & Dola'", 9500, "colliers-femme", "femme", "Double Prénom"),
  (11, "011", "Collier Cœur 'Mom & Daddy'", 9500, "colliers-femme", "femme", "Double Prénom"),
  (12, "012", "Collier Double Prénom Cœur 'Vicky & Efuman'", 9500, "colliers-femme", "femme", "Double Prénom"),
  (13, "013", "Collier Duo Cœurs 'Joshua & Ruben'", 9500, "colliers-femme", "femme", "Double Prénom"),
  (14, "014", "Collier Double Prénom 'Vicky & Efuman Model 2'", 9500, "colliers-femme", "femme", "Double Prénom"),
  (15, "015", "Collier Couronne Royale Double Prénom 'Marisha & Sumon'", 10500, "colliers-femme", "femme", "Double Prénom"),
  (16, "016", "Collier Étoiles & Cœur 'Rayhan & Subhra'", 10500, "colliers-femme", "femme", "Double Prénom"),
  (17, "017", "Collier Couronne & Papillon 'Angel Baby'", 10000, "colliers-femme", "femme", "Double Prénom"),
  (18, "018", "Collier Pendentif Asymétrique 'Marcus & Malaysia'", 10500, "colliers-femme", "femme", "Double Prénom"),
  (19, "019", "Collier Rose Royale & Feuillage 'Brianna'", 11000, "colliers-femme", "femme", "Modèle Prestorie"),

  # PAGE 5 - MODELS EN FORME DE COEUR (020 - 029)
  (20, "020", "Collier Cœur Dauphin 'Mickey'", 10000, "colliers-femme", "femme", "Forme de Cœur"),
  (21, "021", "Collier Cœur Silhouette Fée 'Madina'", 10500, "colliers-femme", "femme", "Forme de Cœur"),
  (22, "022", "Collier Cœur Stéthoscope 'Ethan'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (23, "023", "Collier Cœur Filigrane 'Izumi'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (24, "024", "Collier Cœur Dentelle Royale 'Ansari'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (25, "025", "Collier Cœur Filiforme 'Gloria & Donald'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (26, "026", "Collier Cœur Fleurs & Trèfles 'Natalie'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (27, "027", "Collier Cœur Calligraphie Orientale 'Qitian'", 8000, "colliers-femme", "femme", "Forme de Cœur"),
  (28, "028", "Collier Cœur Couronne & Papillon 'Darlene'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (29, "029", "Collier Cœur Pulsation 'Sweety'", 8500, "colliers-femme", "femme", "Forme de Cœur"),

  # PAGE 6 - MODELS EN FORME DE COEUR (030 - 039)
  (30, "030", "Collier Cœur Flèche de Cupidon 'Shiloh'", 9000, "colliers-femme", "femme", "Forme de Cœur"),
  (31, "031", "Collier Arbre de Vie Multi-Prénoms 'Emma, Ashley, Brianna'", 12000, "colliers-femme", "femme", "Famille & Multi-Prénoms"),
  (32, "032", "Collier Cœur Infini 'Eliana & Baptiste'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (33, "033", "Collier Cœur Épuré 'Brianna'", 7500, "colliers-femme", "femme", "Forme de Cœur"),
  (34, "034", "Collier Cœur Clef de Sol 'Sabrina'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (35, "035", "Collier Cœur Volutes 'Mustafa'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (36, "036", "Collier Cœur Asymétrique 'Emma & Luana'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (37, "037", "Collier Cœur Battement 'Custom'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (38, "038", "Collier Cœur Arabesques 'Tabish'", 10500, "colliers-femme", "femme", "Forme de Cœur"),
  (39, "039", "Collier Cœur Couronne 'Zimam'", 10500, "colliers-femme", "femme", "Forme de Cœur"),

  # PAGE 7 - MODELS COEUR (040 - 049)
  (40, "040", "Collier Cœur Duo 'Pepina & Eden'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (41, "041", "Collier Cœur Couronne & Prénoms 'Shamsa & Waqas'", 9500, "colliers-femme", "femme", "Forme de Cœur"),
  (42, "042", "Collier Cœur & Rose 'Carol'", 9000, "colliers-femme", "femme", "Forme de Cœur"),
  (43, "043", "Collier Cœur Étoilé 'Tushar & Maria'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (44, "044", "Collier Cœur Trèfles 'Chika'", 8500, "colliers-femme", "femme", "Forme de Cœur"),
  (45, "045", "Collier Cœur Graphique 'Hasina'", 8000, "colliers-femme", "femme", "Forme de Cœur"),
  (46, "046", "Collier Cœur & Aile d'Ange 'Marion'", 8000, "colliers-femme", "femme", "Forme de Cœur"),
  (47, "047", "Collier Cœur Ondulé 'Custom'", 9000, "colliers-femme", "femme", "Forme de Cœur"),
  (48, "048", "Collier Médaillon Cœur Plein 'I Love You'", 10500, "colliers-femme", "femme", "Forme de Cœur"),
  (49, "049", "Collier Cœur Stéthoscope 'Ethan Model 2'", 9000, "colliers-femme", "femme", "Forme de Cœur"),

  # PAGE 8 - MODELS STÉTHOSCOPE & DOUBLE CHAINE (050 - 058)
  (50, "050", "Collier Stéthoscope Cœur 'Evelin'", 10000, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (51, "051", "Collier Stéthoscope Pulsation 'Heartbeat'", 10500, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (52, "052", "Collier Stéthoscope Cœur Entrelacé 'Christine'", 10500, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (53, "053", "Collier Stéthoscope Discret 'Shahin'", 9500, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (54, "054", "Collier Stéthoscope Zircon 'Mylann'", 10000, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (55, "055", "Collier Caducée & Infirmière 'Natalie'", 12000, "colliers-femme", "femme", "Stéthoscope & Médical"),
  (56, "056", "Collier Double Chaîne 'Mme Sidibe'", 11500, "colliers-femme", "femme", "Double Chaîne"),
  (57, "057", "Collier Double Chaîne Cœur 'Latifa'", 11000, "colliers-femme", "femme", "Double Chaîne"),
  (58, "058", "Collier Double Chaîne Papillon 'Shanice'", 11000, "colliers-femme", "femme", "Double Chaîne"),

  # PAGE 9 - MODELS EN FORME SOULIGNÉE (059 - 068)
  (59, "059", "Collier Double Chaîne Patte d'Animal 'Langdon'", 11000, "colliers-femme", "femme", "Forme Soulignée"),
  (60, "060", "Collier Double Chaîne Rose 'Maria'", 12000, "colliers-femme", "femme", "Forme Soulignée"),
  (61, "061", "Collier Double Chaîne Étoile 'Sarah'", 10500, "colliers-femme", "femme", "Forme Soulignée"),
  (62, "062", "Collier Double Chaîne Cœur Pendent 'Jaqueline'", 10000, "colliers-femme", "femme", "Forme Soulignée"),
  (63, "063", "Collier Double Chaîne Papillon 'Shashi'", 10000, "colliers-femme", "femme", "Forme Soulignée"),
  (64, "064", "Collier Double Chaîne Cœur Discret", 10000, "colliers-femme", "femme", "Forme Soulignée"),
  (65, "065", "Collier Multirang Étoiles & Papillons 'Crystal'", 11000, "colliers-femme", "femme", "Forme Soulignée"),
  (66, "066", "Collier Prénom Souligné Papillon 'Kamond'", 9500, "colliers-femme", "femme", "Forme Soulignée"),
  (67, "067", "Collier Prénom Souligné Cœur 'Angelbaby'", 9500, "colliers-femme", "femme", "Forme Soulignée"),
  (68, "068", "Collier Prénom Souligné Dauphin 'Andyano'", 10500, "colliers-femme", "femme", "Forme Soulignée"),

  # PAGE 10 - SOULIGNÉS ET MOTIFS (069 - 077)
  (69, "069", "Collier Prénom Rameau de Roses 'Custom'", 11500, "colliers-femme", "femme", "Forme Soulignée"),
  (70, "070", "Collier Prénom Cœur Entrelacé 'Custom'", 8500, "colliers-femme", "femme", "Forme Soulignée"),
  (71, "071", "Collier Prénom Vague & Papillon 'Ndaya'", 9000, "colliers-femme", "femme", "Forme Soulignée"),
  (72, "072", "Collier Prénom Cœur 'Laina'", 8000, "colliers-femme", "femme", "Forme Soulignée"),
  (73, "073", "Collier Prénom Volutes 'Amante'", 8500, "colliers-femme", "femme", "Forme Soulignée"),
  (74, "074", "Collier Prénom Étoiles 'Amonte'", 9500, "colliers-femme", "femme", "Forme Soulignée"),
  (75, "075", "Collier Prénom Étoile Filante 'Manda'", 8000, "colliers-femme", "femme", "Forme Soulignée"),
  (76, "076", "Collier Prénom Licorne Féerique 'Dany'", 9000, "colliers-femme", "femme", "Forme Soulignée"),
  (77, "077", "Collier Prénom Fée Clochette 'Georgette'", 9500, "colliers-femme", "femme", "Forme Soulignée"),

  # PAGE 11 - MOTIFS VARIÉS (078 - 087)
  (78, "078", "Collier Prénom Double Cœur 'Custom'", 8000, "colliers-femme", "femme", "Motifs"),
  (79, "079", "Collier Prénom Bouquet de Fleurs 'Custom'", 9000, "colliers-femme", "femme", "Motifs"),
  (80, "080", "Collier Prénom Feuillage 'Berlinda'", 9000, "colliers-femme", "femme", "Motifs"),
  (81, "081", "Collier Prénom Trèfles 'Promise'", 8500, "colliers-femme", "femme", "Motifs"),
  (82, "082", "Collier Prénom Ailes d'Ange 'Babygirl'", 9500, "colliers-femme", "femme", "Motifs"),
  (83, "083", "Collier Prénom Palmier Tropique 'Faith'", 9000, "colliers-femme", "femme", "Motifs"),
  (84, "084", "Collier Prénom Cœur Pendon 'Madison'", 9000, "colliers-femme", "femme", "Motifs"),
  (85, "085", "Collier Prénom Cœur & Pince 'Monica'", 8000, "colliers-femme", "femme", "Motifs"),
  (86, "086", "Collier Prénom Vague Cœur 'Ndaya'", 8000, "colliers-femme", "femme", "Motifs"),
  (87, "087", "Collier Prénom Tige de Rose 'Milam'", 9500, "colliers-femme", "femme", "Motifs"),

  # PAGE 12 - DESSIN PERSONNALISÉ (088 - 096)
  (88, "088", "Collier Prénom Trèfles de Chance 'Annika'", 8500, "colliers-femme", "femme", "Dessin Personnalisé"),
  (89, "089", "Collier Prénom Cœur 'Ahdiba'", 8000, "colliers-femme", "femme", "Dessin Personnalisé"),
  (90, "090", "Collier Prénom Bouton de Rose 'Natalie'", 9000, "colliers-femme", "femme", "Dessin Personnalisé"),
  (91, "091", "Collier Prénom Cocotier Palmier 'Custom'", 8500, "colliers-femme", "femme", "Dessin Personnalisé"),
  (92, "092", "Collier Initiale 'R' & Prénom 'Rita'", 9000, "colliers-femme", "femme", "Dessin Personnalisé"),
  (93, "093", "Collier Initiale 'M' & Prénom 'Maria'", 9500, "colliers-femme", "femme", "Dessin Personnalisé"),
  (94, "094", "Collier Poisson & Prénom 'Berekua'", 8500, "colliers-femme", "femme", "Dessin Personnalisé"),
  (95, "095", "Collier Monogramme XL 'Kimberley'", 10500, "colliers-femme", "femme", "Dessin Personnalisé"),
  (96, "096", "Collier Lune, Étoiles & Papillons 'Angel'", 8500, "colliers-femme", "femme", "Dessin Personnalisé"),

  # PAGE 13 - MODELS EN FORME "INFINI" (097 - 107)
  (97, "097", "Collier Clé Papillon 'Custom'", 9500, "colliers-femme", "femme", "Forme Infini & Clefs"),
  (98, "098", "Collier Clé Triple Cœurs 'Haint & Waniam'", 9500, "colliers-femme", "femme", "Forme Infini & Clefs"),
  (99, "099", "Collier Papillon Ajouré 'Custom'", 9500, "colliers-femme", "femme", "Forme Infini"),
  (100, "100", "Collier Papillon Ciselé 'Natale'", 8500, "colliers-femme", "femme", "Forme Infini"),
  (101, "101", "Collier Pulsation Cardiaque 'Anne'", 10500, "colliers-femme", "femme", "Forme Infini"),
  (102, "102", "Collier Silhouette Oiseau 'Bunmi'", 10500, "colliers-femme", "femme", "Forme Infini"),
  (103, "103", "Collier Sapin Féerique 'Chienia'", 9500, "colliers-femme", "femme", "Forme Infini"),
  (104, "104", "Collier Infini Double Cœur 'Natale & David'", 10500, "colliers-femme", "femme", "Forme Infini"),
  (105, "105", "Collier Infini Double Prénom 'Baby & Sky'", 9500, "colliers-femme", "femme", "Forme Infini"),
  (106, "106", "Collier Infini Duo Cœurs 'Anam & Faizan'", 9500, "colliers-femme", "femme", "Forme Infini"),
  (107, "107", "Collier Infini Romance 'Diamond & Neres'", 9500, "colliers-femme", "femme", "Forme Infini"),

  # PAGE 14 - MAMAN & COUPLE (108 - 119)
  (108, "108", "Collier Infini Empreintes d'Animaux 'Daisy'", 9500, "colliers-femme", "femme", "Infini & Animaux"),
  (109, "109", "Collier Infini Papillon 'Laura'", 8000, "colliers-femme", "femme", "Forme Infini"),
  (110, "110", "Collier Infini Feuille de Nature 'Lisa'", 8500, "colliers-femme", "femme", "Forme Infini"),
  (111, "111", "Collier Infini Épuré 'Charlston'", 8000, "colliers-femme", "femme", "Forme Infini"),
  (112, "112", "Collier Infini Cœur Entrelacé 'Anne'", 8500, "colliers-femme", "femme", "Forme Infini"),
  (113, "113", "Pendentif Maman Portant son Enfant", 9500, "colliers-femme", "femme", "Collection Maman"),
  (114, "114", "Pendentif Maman Embrassant Bébé", 9000, "colliers-femme", "femme", "Collection Maman"),
  (115, "115", "Pendentif Cœur Silhouette Maman & Enfant", 9000, "colliers-femme", "femme", "Collection Maman"),
  (116, "116", "Pendentif Profil Maman & Bébé", 9000, "colliers-femme", "femme", "Collection Maman"),
  (117, "117", "Collier Maman & Bébé Tendresse 'Kluke'", 10500, "colliers-femme", "femme", "Collection Maman"),
  (118, "118", "Duo de Colliers Couple Demi-Cœurs Gravés (M&A / Sofia)", 14000, "colliers-homme-couple", "couple", "Collection Couple"),
  (119, "119", "Duo Colliers Couple Cœur & Clé Serrure 'David & Sandra'", 15500, "colliers-homme-couple", "couple", "Collection Couple"),

  # PAGE 15 - MODELS HOMME & COUPLE (120 - 132)
  (120, "120", "Duo Colliers Couple Cœur Cassé Zircon 'Nancy & Thomas'", 15500, "colliers-homme-couple", "couple", "Collection Couple"),
  (121, "121", "Duo Colliers Couple Ailes d'Ange 'David & Emily'", 12500, "colliers-homme-couple", "couple", "Collection Couple"),
  (122, "122", "Duo Colliers Plaques Rectangulaires 'His Only / Her Only'", 15500, "colliers-homme-couple", "couple", "Collection Couple"),
  (123, "123", "Duo Colliers Promesse de Doigts 'Forever'", 15500, "colliers-homme-couple", "couple", "Collection Couple"),
  (124, "124", "Duo Colliers Plaques Couronne 'His King / Her Queen'", 16500, "colliers-homme-couple", "couple", "Collection Couple"),
  (125, "125", "Duo Colliers Pièces de Puzzle 'King & Queen'", 16500, "colliers-homme-couple", "couple", "Collection Couple"),
  (126, "126", "Duo Colliers Yin & Yang 'Jennifer & Robert'", 12500, "colliers-homme-couple", "couple", "Collection Couple"),
  (127, "127", "Duo Colliers Cœurs Bicolores 'I Love You'", 15500, "colliers-homme-couple", "couple", "Collection Couple"),
  (128, "128", "Duo Colliers Cœur Trèfle & Clef", 15000, "colliers-homme-couple", "couple", "Collection Couple"),
  (129, "129", "Duo Colliers Cœurs Imbriqués Dorés", 15000, "colliers-homme-couple", "couple", "Collection Couple"),
  (130, "130", "Duo Colliers Solitaires sertis King & Queen", 16000, "colliers-homme-couple", "couple", "Collection Couple"),
  (131, "131", "Collier Homme Couronne & Prénom 'JACKSON'", 9500, "colliers-homme-couple", "homme", "Collection Homme"),
  (132, "132", "Collier Homme Couronne Royale 'CRYSTAL'", 8500, "colliers-homme-couple", "homme", "Collection Homme"),

  # PAGE 16 - MODELS HOMME (133 - 143)
  (133, "133", "Collier Homme Couronne Filigrane 'CUSTOM'", 9500, "colliers-homme-couple", "homme", "Collection Homme"),
  (134, "134", "Collier Homme Gourmette Maillons Épais 'NELSON ALDRICH'", 10500, "colliers-homme-couple", "homme", "Collection Homme"),
  (135, "135", "Collier Homme Chaîne Maille 'LEO BIBIANA'", 9500, "colliers-homme-couple", "homme", "Collection Homme"),
  (136, "136", "Collier Homme Prénom 3D Relief 'ROSE BILLY'", 10000, "colliers-homme-couple", "homme", "Collection Homme"),
  (137, "137", "Collier Homme Plaque Militaire Rectangulaire 'Frederic'", 9500, "colliers-homme-couple", "homme", "Collection Homme"),
  (138, "138", "Collier Homme Plaque Verticale Étroite 'Frederic'", 8500, "colliers-homme-couple", "homme", "Collection Homme"),
  (139, "139", "Collier Homme Maille Cubaine & Prénom 'SMILEY'", 10500, "colliers-homme-couple", "homme", "Collection Homme"),
  (140, "140", "Collier XL Typographie 'KIMBERLEY'", 10500, "colliers-homme-couple", "homme", "Collection Homme"),
  (141, "141", "Collier Tour Eiffel Initiale A 'CUSTOM'", 9500, "colliers-homme-couple", "mixte", "Collection Mixte"),
  (142, "142", "Collier Grande Couronne Impériale 'Custom Name'", 9500, "colliers-homme-couple", "mixte", "Collection Mixte"),
  (143, "143", "Collier Cœur Flèche Cupidon 'Custom'", 9500, "colliers-femme", "femme", "Collection Romance"),

  # PAGE 17 - SPORT & SYMBOLES (144 - 153)
  (144, "144", "Collier Clé Couronne Royale 'Prince Waniam'", 9500, "colliers-femme", "femme", "Symboles & Clefs"),
  (145, "145", "Collier Croix Latine Verticale 'NELSON'", 9000, "colliers-homme-couple", "mixte", "Croix & Foi"),
  (146, "146", "Collier Croix Latine Horizontale 'Mabell'", 9500, "colliers-femme", "femme", "Croix & Foi"),
  (147, "147", "Collier Cravate Personnalisée 'Sophia'", 9000, "colliers-femme", "femme", "Accessoire Mode"),
  (148, "148", "Collier Clé de Sol Musique 'Danyletta'", 9000, "colliers-femme", "femme", "Musique"),
  (149, "149", "Collier Terrain & Ballon de Football 'Maradona'", 10500, "colliers-homme-couple", "mixte", "Collection Sport"),
  (150, "150", "Collier Ballon & Chaussure de Foot 'Isarael'", 10500, "colliers-homme-couple", "mixte", "Collection Sport"),
  (151, "151", "Collier Demi-Ballon de Football 'MICHAEL'", 10500, "colliers-homme-couple", "mixte", "Collection Sport"),
  (152, "152", "Collier Joueur de Football 'Luisito 12'", 10500, "colliers-homme-couple", "mixte", "Collection Sport"),
  (153, "153", "Collier Panier de Basketball 'ALEX'", 10500, "colliers-homme-couple", "mixte", "Collection Sport"),

  # PAGE 18 - BOUCLES D'OREILLES (154 - 163)
  (154, "154", "Boucles d'Oreilles Ballon de Basketball 'Custom'", 9000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (155, "155", "Boucles d'Oreilles Diamant & Géométrie 'Custom'", 10500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (156, "156", "Boucles d'Oreilles Lapin & Plaque 'Custom'", 10000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (157, "157", "Boucles d'Oreilles Arbre de Vie 'Jaxon & Hudson'", 10500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (158, "158", "Boucles d'Oreilles Couronne Royale '2021 CROWN'", 10500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (159, "159", "Boucles d'Oreilles Scorpion 'Custom'", 10500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (160, "160", "Boucles d'Oreilles Écrevisse Homard 'Custom'", 10000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (161, "161", "Puces d'Oreilles Cœur & Prénom 'Nana'", 8000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (162, "162", "Puces d'Oreilles Duo Prénoms 'Kessie'", 7500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (163, "163", "Puces d'Oreilles Cœurs Géants 'Emma'", 8000, "boucles-oreilles", "femme", "Boucles d'oreilles"),

  # PAGE 19 - BOUCLES D'OREILLES (164 - 173)
  (164, "164", "Puces d'Oreilles Barrette 'Jemmy'", 7000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (165, "165", "Pendants d'Oreilles Crochets 'Emma'", 7500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (166, "166", "Puces d'Oreilles Cœurs Entrelacés 'Andie'", 7500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (167, "167", "Créoles Circulaires Prénom 'Custom'", 9500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (168, "168", "Double Créoles Circulaires 'Lorraine Smith'", 8000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (169, "169", "Créoles Polygone Fleur 'Custom'", 10000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (170, "170", "Créoles Hexagonales 'Julie'", 9000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (171, "171", "Créoles avec Chaîne Pendante 'Ashley'", 8500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (172, "172", "Créoles Triangulaires 'Custom'", 8500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (173, "173", "Grands Anneaux Créoles 'Michael'", 10000, "boucles-oreilles", "femme", "Boucles d'oreilles"),

  # PAGE 20 - BRACELETS (174 - 184)
  (174, "174", "Créoles Étoiles 'Babygirl'", 10500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (175, "175", "Créoles Cœur Géant 'Babygirl'", 10000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (176, "176", "Créoles Losange 'Aazhae'", 9000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (177, "177", "Créoles Barrette 'Ailsa'", 9000, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (178, "178", "Créoles Croissant de Lune 'Custom'", 8500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (179, "179", "Pendants Ronds Arabesques 'Julia'", 9500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (180, "180", "Créoles Carte de l'Afrique", 9500, "boucles-oreilles", "femme", "Boucles d'oreilles"),
  (181, "181", "Bracelet Gourmette Maillons Épais 'King / Custom'", 10500, "bracelets", "mixte", "Bracelets"),
  (182, "182", "Bracelet Chaîne & Plaque Gravée 'Devirai'", 9000, "bracelets", "femme", "Bracelets"),
  (183, "183", "Bracelet Jonc Ouvert Ajustable 'Arbonne'", 10000, "bracelets", "femme", "Bracelets"),
  (184, "184", "Bracelet Jonc Croix Latine Gravé 'Philippians 4:13'", 10500, "bracelets", "mixte", "Bracelets"),

  # PAGE 21 - BAGUES & BRACELETS (185 - 194)
  (185, "185", "Bracelets Jonc Multi-Couches 'William, Emilia, Jackson'", 10000, "bracelets", "femme", "Bracelets"),
  (186, "186", "Bracelets Jonc Rigide Chiffres Romains 'VII.XXV.MMXV'", 9000, "bracelets", "mixte", "Bracelets"),
  (187, "187", "Bracelets Cordon Tressé Plaque Gravée", 7500, "bracelets", "mixte", "Bracelets"),
  (188, "188", "Bracelets Cordon Couleur & Perles 'Maria'", 8000, "bracelets", "femme", "Bracelets"),
  (189, "189", "Bague Double Anneau Gravée 'I am enough'", 7500, "bagues", "femme", "Bagues"),
  (190, "190", "Bague Prénom Cursive 'Najma'", 7000, "bagues", "femme", "Bagues"),
  (191, "191", "Bague Prénoms Multiples / Trilogies 'Maya, Scarlet, Sarah'", 9000, "bagues", "femme", "Bagues"),
  (192, "192", "Bague Nœud de l'Infini 'Forever'", 8500, "bagues", "femme", "Bagues"),
  (193, "193", "Bague Infini Plaque Gravée 'AUDREY'", 7500, "bagues", "femme", "Bagues"),
  (194, "194", "Bague Ouverte Cœur & Prénom 'Anna'", 9000, "bagues", "femme", "Bagues"),

  # PAGE 22 - BAGUES (195 - 206)
  (195, "195", "Bague Couronne Impériale & Prénom 'Custom'", 8500, "bagues", "femme", "Bagues"),
  (196, "196", "Bague Petite Couronne & Prénom 'Alice'", 8500, "bagues", "femme", "Bagues"),
  (197, "197", "Bague Deux Mains Cœur 'Love'", 9000, "bagues", "femme", "Bagues"),
  (198, "198", "Bague Fleur & Prénom 'Custom'", 8500, "bagues", "femme", "Bagues"),
  (199, "199", "Bague Cœur & Prénom Cursif 'Angelina'", 8500, "bagues", "femme", "Bagues"),
  (200, "200", "Bague Année de Naissance Zircon '1997'", 8500, "bagues", "femme", "Bagues"),
  (201, "201", "Bague Année de Naissance Solitaire '1997'", 8500, "bagues", "femme", "Bagues"),
  (202, "202", "Bague Infini Cursive 'Sweet'", 8500, "bagues", "femme", "Bagues"),
  (203, "203", "Bague Cœur Minimaliste 'Cute'", 8500, "bagues", "femme", "Bagues"),
  (204, "204", "Bague Large Anneau Homme / Femme 'Daniel'", 8500, "bagues", "mixte", "Bagues"),
  (205, "205", "Bague Année Découpée 3D '1994'", 7500, "bagues", "mixte", "Bagues"),
  (206, "206", "Bague Signalétique En Relief 'BOSS'", 7500, "bagues", "homme", "Bagues"),

  # PAGE 23 - MANCHETTES DE CHEMISE (207 - 211)
  (207, "207", "Bague Gothique 'Dad'", 7500, "bagues", "homme", "Bagues"),
  (208, "208", "Duo de Bagues Soleil, Lune & Couronne", 8500, "bagues", "femme", "Bagues"),
  (209, "209", "Boutons de Manchette Ovales Gravés 'Susan'", 8000, "manchettes", "homme", "Manchettes de chemise"),
  (210, "210", "Boutons de Manchette Initiales Découpées 'Kathe'", 8000, "manchettes", "homme", "Manchettes de chemise"),
  (211, "211", "Boutons de Manchette Rectangulaires 'Best Man / August 19'", 8500, "manchettes", "homme", "Manchettes de chemise"),
]

product_items = []

for num, ref, name, price, sub_cat, gender, section in raw_catalog_data:
    cat = "bijoux"
    img_url = f"/images/products/model-{num:03d}.jpg"
    badge = "Offre Spéciale" if num in [1, 6, 15, 118, 119, 131, 181] else ("Best-Seller" if num % 7 == 0 else None)
    is_featured = num in [1, 2, 6, 15, 50, 118, 119, 131, 181, 209]
    
    badge_str = f"badge: '{badge}'," if badge else ""
    featured_str = f"isFeatured: {str(is_featured).lower()},"
    
    item_code = f"""  {{
    id: 'prod-{num:03d}',
    refCode: '{ref}',
    name: {json.dumps(name)},
    category: '{cat}',
    subCategory: '{sub_cat}',
    gender: '{gender}',
    price: {price},
    description: 'Bijou personnalisé sur-mesure de la collection Anonyme Empire. Acier Inoxydable 316L garanti 1 an sans rouille ni noircissement.',
    imageUrl: '{img_url}',
    {featured_str}
    {badge_str}
    material: 'Acier Inoxydable 316L Plaqué Or',
    guarantee: '1 An de Garantie Officielle',
    customizationOptions: {{ allowName: true, allowDate: true }},
  }},"""
    product_items.append(item_code)

extra_products = [
  """  {
    id: 'prod-p01',
    refCode: 'P01',
    name: "Parfum d'Exception Anonyme Empire 100ml",
    category: 'parfums',
    subCategory: 'parfums',
    gender: 'mixte',
    price: 18000,
    description: "Eau de parfum de luxe personnalisée. Flacon gravé au prénom de votre choix.",
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    isFeatured: true,
    badge: 'Luxe',
    material: 'Flacon Verre & Gravure Laser',
    guarantee: '100% Authentique',
  },""",
  """  {
    id: 'prod-e01',
    refCode: 'E01',
    name: "Coffret Prestige Royal & Pochette Velours",
    category: 'emballages',
    subCategory: 'emballages',
    gender: 'mixte',
    price: 3500,
    description: "Écrin boîte métallique noire & or, pochon velours royal et sac cadeau Anonyme Empire.",
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    isFeatured: true,
    badge: 'Packaging',
    material: 'Boîte Métal & Velours',
  },""",
  """  {
    id: 'prod-a01',
    refCode: 'A01',
    name: "Porte-Clés Cuir & Plaque Acier Gravée",
    category: 'accessoires',
    subCategory: 'accessoires',
    gender: 'mixte',
    price: 5000,
    description: "Porte-clés de luxe personnalisé avec nom, prénom ou numéro de téléphone.",
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    isFeatured: false,
    material: 'Cuir Véritable & Acier',
  },"""
]

all_items_joined = "\n".join(product_items)
all_extras_joined = "\n".join(extra_products)

file_content = f"""import {{ Product }} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
{all_items_joined}
{all_extras_joined}
];
"""

with open(r"c:\Users\HP\Downloads\anonym-—-anonyme-empire\src\data\products.ts", "w", encoding="utf-8") as f:
    f.write(file_content)

print("Generated products.ts with all 211 catalog products successfully!")
