# Swipe Extended Slider

**Swipe Extended Slider** (Swipext) est un plugin **jQuery** qui étend l'excellent
[Swipe slider de Brad Birdsall][1] avec de nouvelles fonctionnalités comme le **chargement différé
des images**, la **navigation** et la **pagination**.

J'ai dû, pour les besoins d'un site Web, installer un slider qui devait gérer plus de 300 images et
qui devait être compatible avec les périphériques tactiles (iPhone, iPad, ...). L'ennui, c'est que
sur ce genre de périphérique, les navigateurs web sont le plus souvent limités en consommation
mémoire. Avec mes 300 diapos, Safari mobile plantait systematiquement (à l'époque, c'était sur iPad2
et iPhone 4).

**Swipext** peut gérer n'importer quel contenu dans les slides mais est spécialement préparé pour
gérer une structure volumineuse HTML5 figure/figcatpion.

Intéressé ? Voyez la suite...

## Utilisation
### Structure HTML

#### Structure minimum

``` html
<div class="swipext">
	<div class="swipe">
		<div class="swipe-wrap">
			<div class="swipe-slide">Slide content 1</div>
			<div class="swipe-slide">Slide content 2</div>
		</div>
	</div>
</div>
```

#### Structure complète

``` html
<div class="swipext">
	<div class="swipe">
		<div class="swipe-wrap">
			<div class="swipe-slide">Slide content 1</div>
			<div class="swipe-slide">Slide content 2</div>
		</div>
	</div>
	<div class="swipe-nav">
		<button class="swipe-prev">Prev.</button>
		<button class="swipe-next">Next</button>
	</div>
	<div class="swipe-pages" data-tag="button"></div>
	<div class="swipe-caption"></div>
</div>
```

Vous pouvez voir ici les fonctionnalités supplémentaires :

 * `.swipe-prev`, `.swipe-prev` : les boutons de navigations reconnus par Swipext,
 * `.swipe-pages` : le noeud du DOM ou sont insérés les boutons de pagination,
 * `.swipe-caption` : le noeud du DOM ou est dupliquée la légende de la diapo courante. 

Ces noeuds ne sont pas obligatoires : les ajouter/enlever revient à activer/désactiver la
fonctionnalité liée.

`.swipe-nav` n'est pas reconnu par Swipext ; c'est un simple noeud qui permet d'embarquer les
boutons de navigation.

#### Balise des boutons de pagination

Par défaut, Swipext utilise la balise `button` pour générer la pagination.

Vous pouvez changer cette balise depuis l'attribut `data-tag` de l'élément `.swipe-pages`. Il
devient alors possible de mettre une pagination du type :

``` html
<ul class="swipe-pages" data-tag="li"></ul>
```

### Règles CSS de base

``` css
/**
 * Swipejs base rules
 */
.swipe {
	overflow: hidden;
	visibility: hidden;
	position: relative;
}
.swipe-wrap {
	overflow: hidden;
	position: relative;
}
.swipe-wrap > .swipe-slide {
	float:left;
	width:100%;
	position: relative;
	margin:0;
}
.swipe-slide img {
	vertical-align: middle;
	width: 100%;
}
figure.swipe-slide { text-align: center; }

/**
 * Swipext base rules
 */
.swipext { position: relative; }
.swipext button { cursor: pointer; }
```

### Structure CSS complète

Swipext utilises les classes CSS pour manipuler les éléments du slider et voici la structure
complète qu'il reconnait :

	.swipext
		.swipe
			.swipe-wrap
				.swipe-slide
					img (this is the only element selected by tag)
					.swipe-slide-caption
		.swipe-prev
		.swipe-next
		.swipe-pages
			.swipe-page
		.swipe-caption

Cela signigie que **vous êtes libres d'utiliser les balises HTML que vous voulez pour chaque
élément** puisque Swipext ne s'en occupe pas.

### Mise en place Javascript

Pour faire fonctionner Swipext, vous devez inclure **jQuery** et **Swipe**. J'ai l'habitude
d'inclure les dépendances depuis le bas de page (et vous devriez faire de même ;-) sauf en cas de
besoins spécifiques) :

``` html
		...

		<script src="jquery.js"></script>
		<script src="swipe.js"></script>
		<script src="swipext.js"></script>
		<script type="text-javascript">

			jQuery(document).ready(function($) {

			 	$('.swipext').swipext();
			});

		</script>
	</body>
</html>
```

### Options

Toutes les options de Swipe sont applicables à Swipext. [Voir les options de Swipe][2].

Les options ajoutées par Swipext sont les suivantes (_nom, type, valeur par défaut_) :

 - **lazyLoad**, boolean, false : `true` pour activer le chargement différé des images,
 - **lazyLoadRange**, integer, 1 : nombre d'images chargées autour de la diapo courante,
 - **defaultImg**, string, 'data:...' : image de remplacement utilisée pour le chargement différé
 (données en base 64 ou chemin),
 - **hideClass**, string, 'hide' : classe CSS utilisée pour masquer les boutons de navigation
 lorsque le caroussel n'est pas en continu et affiche la 1ère ou la dernière diapo,
 - **activeClass**, string, 'active' : classe CSS utiliser pour marquer le `.swipe-page` de la diapo
 courante.

**Attention :** quand **lazyLoad** est à **true**, **startSlide** est forcée **0**.

#### Appliquer à un ensemble de caroussels

Vous pouvez appliquer les options au sélecteur jQuery :

``` javascript
jQuery(document).ready(function($) {

	$('.swipext').swipext({
	
		lazyLoad:		false,			// Chargement différé
		lazyLoadRange:	1,				// Intervalle du chargement différé
		hideClass:		'hide',			// Classe CSS pour masquer les boutons de navigation
		activeClass:	'active',		// Classe CSS pour marquer le bouton de la page courante
		defaultImg:		'default.jpg',	// Image par défaut pour le chargement différé
		auto:			false,			// Défilement automatique, millisecondes
		continuous:		false,			// Retourner au début après la dernière diapo
		startSlide:		0				// Indice de la diapo de démarrage
	});
});
```

#### Appliquer par slider

Swipext vous permet de paramétrer certaines options directement depuis le caroussel grâce à des
attributs `data-*` :

``` html
<div class="swipext"
	data-lazyload="true"
	data-lazyloadrange="2"
	data-continuous="true"
	data-auto="5000"
	data-speed="300"
	data-startslide="3"
	data-hideclasse="hide"
	data-activeclasse="active"
	data-defaultimg="default.jpg">
	<div class="swipe">...</div>
</div>
```

## Chargement différé : comment faire ?
### Mettre en place la structure HTML

Installer un caroussel à chargement différé est plutôt simple. Jetez un oeil au code HTML suivant :

``` html
<div class="swipext" data-lazyload="true" data-continuous="true" data-auto="0" data-speed="300">
	<div class="swipe">
		<div class="swipe-wrap">

			<figure class="swipe-slide">
				<img src="img/image_01.jpg" data-src="img/image_01.jpg" alt="image_01" />
				<figcaption class="swipe-slide-caption">image 01</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_02.jpg" alt="image_02" />
				<figcaption class="swipe-slide-caption">image 02</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_03.jpg" alt="image_03" />
				<figcaption class="swipe-slide-caption">image 03</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_04.jpg" alt="image_04" />
				<figcaption class="swipe-slide-caption">image 04</figcaption>
			</figure>
		</div>
	</div>
	<div class="swipe-nav">
		<button class="swipe-prev">Prev.</button>
		<button class="swipe-next">Next</button>
	</div>
	<div class="swipe-pages"></div>
	<div class="swipe-caption"></div>
</div>
```

 - Chaque diapositive est une **figure**,
 - Chaque `img` contenue doit avoir deux attributs : `src` et `data-src`,
 - `data-src` doit contenir l'URI de l'image,
 - L'attribut `src` de la **première** diapo doit contenir l'URI de l'image,
 - Tous les autres attributs `src` doivent contenir une image vide. La valeur
 `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7` est la
 représentation en base 64 d'un gif transparent de 1x1 px,
 - Swipext masque automatiquement tous les **.swipe-slide-caption** et remplace **.swipe-caption**
 avec la légende de la diapo courante : c'est nettement plus pratique pour la mise en place CSS ;-)

**Pourquoi utiliser cette étrange image en base 64 ?**

Afin de décharger l'image du navigateur pour libérer de la mémoire, enlever l'attribut `src` ne
suffit pas. Vous devez écraser l'image et la remplacer par ce gif transparent fonctionne plutôt
bien :-).

**Astuce** : selon votre thème graphique, vous préférerez peut-être utiliser un gif noir. Dans ce
cas, la valeur en base 64 est
`data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=`.

### Intervalle de chargement différé

Ce paramètre vous permet de choisir le nombre d'images à charger autour de la diapo courante.

Voici la séquence de fonctionnement pour un caroussel non continu avec un intervalle de 1 :

	x = image chargée
	X = diapositive courante
	- = image déchargée

	HTML : X - - - -	(correspond au code ci-dessus)
	INIT : X x - - -	(après l'initialisation de Swipext)
	NEXT : x X x - -	(après clic sur le bouton suivant)
	NEXT : - x X x -
	NEXT : - - x X x
	NEXT : - - - x X

Maintenant, voici la séquence de fonctionnement pour un caroussel en continu, toujours avec un
intervalle de 1 :

	HTML : X - - - -
	INIT : X x - - x	(la dernière diapo est chargée car vous pouvez revenir en arrière)
	NEXT : x X x - -	
	NEXT : - x X x -
	NEXT : - - x X x
	NEXT : x - - x X
	NEXT : X x - - x

Exercice : écrivez la séquence de fonctionnement avec un intervalle de 2 :-D (ou plus).

## Compatibilité

Swipext est autant compatible que [Swipe][1] avec les navigateurs.

J'ai développé Swipext avec jQuery 1.10.1 mais les versions antérieurs devraient être compatibles
(non testé).

## Qui utilise Swipext ?

Pour l'instant, personne ;-). Si Swipext répond à vos besoins et que vous l'utilisez pour votre
site, je serais ravis de l'apprendre et de publier votre lien ici.

  [1]: http://swipejs.com
  [2]: https://github.com/bradbirdsall/Swipe#config-options