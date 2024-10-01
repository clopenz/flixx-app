const global = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 1,
		totalResults: 0,
	},
	api: {
		apiKey: '906421d055fd2eed16b91916f1e3dcb3',
		apiUrl: 'https://api.themoviedb.org/3/',
	},
};

// Switch between Now Playing and Upcoming
const upcomingButton = document.querySelector(
	'.now-playing-upcoming h2.upcoming'
);
const nowPlayingButton = document.querySelector(
	'.now-playing-upcoming h2.now-playing'
);

if (upcomingButton && nowPlayingButton) {
	upcomingButton.addEventListener('click', () => {
		upcomingButton.classList.add('active');
		nowPlayingButton.classList.remove('active');
		displaySlider();
	});

	nowPlayingButton.addEventListener('click', () => {
		nowPlayingButton.classList.add('active');
		upcomingButton.classList.remove('active');
		displaySlider();
	});
}

async function displayPopularMovies() {
	const { results } = await fetchAPIData('movie/popular');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
               ${
									movie.poster_path
										? `<img
                  src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                  class="card-img-top"
                  alt="${movie.title}" 
               />`
										: `<img
               src="images/no-image.jpg"
               class="card-img-top"
               alt="${movie.title}" />`
								}
            
            <div class="card-body">
               <h5 class="card-title">${movie.title}</h5>
               <p class="card-text">
                  <small class="text-muted">Release: ${
										movie.release_date
									}</small>
               </p>
            </div>
				</a>`;

		document.querySelector('#popular-movies').appendChild(div);
	});
}

// Display 20 most popular tv shows
async function displayPopularShows() {
	const { results } = await fetchAPIData('tv/popular');

	results.forEach((show) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
               ${
									show.poster_path
										? `<img
                  src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                  class="card-img-top"
                  alt="${show.name}" 
               />`
										: `<img
               src="images/no-image.jpg"
               class="card-img-top"
               alt="${show.name}" />`
								}
            
            <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">
                  <small class="text-muted">Air Date: ${
										show.first_air_date
									}</small>
               </p>
            </div>
				</a>`;

		document.querySelector('#popular-shows').appendChild(div);
	});
}

// Display popular actors
async function displayPopularActors() {
	const { results } = await fetchAPIData('person/popular');

	results.forEach((person) => {
		if (person.known_for_department !== 'Acting') return;
		const movie_title = person.known_for.map(
			(movie) => movie.title || movie.name
		);

		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `

            <a href="actor-details.html?id=${person.id}">
               ${
									person.profile_path
										? `<img
                  src="https://image.tmdb.org/t/p/w500${person.profile_path}"
                  class="card-img-top"
                  alt="${person.name}" 
               />`
										: `<img
               src="images/no-image.jpg"
               class="card-img-top"
               alt="${person.name}" />`
								}
            
            <div class="card-body">
               <h5 class="card-title">${person.name}</h5>
               <p class="card-text">
                  <small class="text-muted">${movie_title.join(' | ')}</small>
               </p>
            </div>
				</a>`;

		document.querySelector('#popular-actors').appendChild(div);
	});
}

// Display Movie Details
async function displayMovieDetails() {
	let currentDate = new Date().toJSON().slice(0, 10);

	const movieId = window.location.search.split('=')[1];

	const movie = await fetchAPIData(`movie/${movieId}`);

	// Overlay for background image
	displayBackgroundImage('movie', movie.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `<div class="details-top"><div> 
		${
			movie.poster_path
				? `<img
			src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
			class="card-img-top"
			alt="${movie.title}" 
			/>`
				: `<img
			src="images/no-image.jpg"
			class="card-img-top"
			alt="${movie.title}" />`
		}
							</div>
   <div>
     <h2>${movie.title}</h2>
     <p class="rating">
      ${
				movie.release_date < currentDate
					? '<i class="fas fa-star text-primary"></i>' +
					  movie.vote_average.toFixed(1) +
					  '/10'
					: ''
			}
     </p>
     <p class="text-muted">Release Date: ${movie.release_date}</p>
     <p>
         ${movie.overview}
     </p>
     <h5>Genres</h5>
     <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
     </ul>
     <a href="${
				movie.homepage
			}" target="_blank" class="btn">Visit Movie Homepage</a>
   </div>
 </div>
 <div class="details-bottom">
   <h2>Movie Info</h2>
   <ul>
     <li><span class="text-secondary">Budget:</span> ${
				movie.budget > 0 ? '$' + addCommasToNumber(movie.budget) : 'Unknown'
			}</li>
     <li><span class="text-secondary">Revenue:</span> ${
				movie.revenue > 0 ? '$' + addCommasToNumber(movie.revenue) : 'Unknown'
			}</li>
     <li><span class="text-secondary">Runtime:</span> ${
				movie.runtime
			} minutes</li>
     <li><span class="text-secondary">Status:</span> ${movie.status}</li>
   </ul>
   <h4>Production Companies</h4>
   <div class="list-group">${movie.production_companies
			.map((company) => `<span>${company.name}</span>`)
			.join(' | ')}
      </div>
   </div>
   `;

	document.querySelector('#movie-details').appendChild(div);
}

// Display Show Details
async function displayShowDetails() {
	const showId = window.location.search.split('=')[1];

	const show = await fetchAPIData(`tv/${showId}`);

	// Overlay for background image
	displayBackgroundImage('tv', show.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `        <div class="details-top">
   <div>
   ${
			show.poster_path
				? `<img
src="https://image.tmdb.org/t/p/w500${show.poster_path}"
class="card-img-top"
alt="${show.name}" 
/>`
				: `<img
src="images/no-image.jpg"
class="card-img-top"
alt="${show.name}" />`
		}
   </div>
   <div>
     <h2>${show.name}</h2>
     <p>
       <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
     </p>
     <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
     <p>
         ${show.overview}
     </p>
     <h5>Genres</h5>
     <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
     </ul>
     <a href="${
				show.homepage
			}" target="_blank" class="btn">Visit show Homepage</a>
   </div>
 </div>
 <div class="details-bottom">
   <h2>Show Info</h2>
   <ul>
     <li><span class="text-secondary">Number of Episodes:</span> ${
				show.number_of_episodes
			}</li>
     <li><span class="text-secondary">Last Episode to Air:</span> ${
				show.last_episode_to_air.name
			}</li>
     <li><span class="text-secondary">Status:</span> ${show.status}</li>
   </ul>
   <h4>Production Companies</h4>
   <div class="list-group">${show.production_companies
			.map((company) => `<span>${company.name}</span>`)
			.join(' | ')}
      </div>
   </div>
   `;

	document.querySelector('#show-details').appendChild(div);
}

// Display Actor Details
async function displayActorDetails() {
	const actorId = window.location.search.split('=')[1];

	const actor = await fetchAPIData(`person/${actorId}`);
	const actor_credits = await fetchAPIData(
		`person/${actorId}/combined_credits`
	);

	const title = actor_credits.cast
		.map((cast) => {
			return cast.title || cast.name;
		})
		.slice(0, 20);

	const birthday = new Date(actor.birthday);
	const deathday = new Date(actor.deathday);
	const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
	formattedBirthday = birthday.toLocaleDateString('en-US', dateFormat);
	formattedDeathday = deathday.toLocaleDateString('en-US', dateFormat);

	const div = document.createElement('div');

	div.innerHTML = `<div class="actor-details-top">
	<div> 
		${
			actor.profile_path
				? `<img
			src="https://image.tmdb.org/t/p/w500${actor.profile_path}"
			class="card-img-top"
			alt="${actor.name}" 
			/>`
				: ''
		}
	</div>
   <div class="actor-details-info">
     <h2>${actor.name}</h2>
	  <h4>${formattedBirthday}</h4>
	  <h4>${actor.deathday ? '- ' + formattedDeathday : ''}</h4>
     <p class="rating">
      ${
				actor.popularity
					? '<i class="fas fa-star text-primary"></i>' +
					  actor.popularity.toFixed(0)
					: ''
			}
     </p>
	  ${
			actor.biography
				? `<h3 class="bio-heading">Biography</h3>
		<p>
			${actor.biography}
		</p>`
				: ''
		}


		${
			actor.homepage
				? `<a href="${actor.homepage}" target="_blank" class="btn">Visit Actor Homepage</a>`
				: ''
		}


	  <div class="known-for">
	  <h3 class="credit-heading">Cast Credits</h3>
	  	<div id="actor-known-for-grid" class="grid">
			${title.join(' | ')}
	  	</div>
	  </div>
   </div>
 </div>

   `;

	document.querySelector('#actor-details').appendChild(div);
}

// Display Backdrop on Details Pages
function displayBackgroundImage(type, backgroundPath) {
	const overlayDiv = document.createElement('div');
	overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
	overlayDiv.style.backgroundSize = 'cover';
	overlayDiv.style.backgroundPosition = 'center';
	overlayDiv.style.backgroundRepeat = 'no-repeat';
	overlayDiv.style.height = '100vh';
	overlayDiv.style.width = '100vw';
	overlayDiv.style.position = 'absolute';
	overlayDiv.style.top = '0';
	overlayDiv.style.left = '0';
	overlayDiv.style.zIndex = '-1';
	overlayDiv.style.opacity = '0.1';

	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlayDiv);
	} else {
		document.querySelector('#show-details').appendChild(overlayDiv);
	}
}

// Search Movies/Shows/Actors
async function search() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');

	if (global.search.term !== '' && global.search.term !== null) {
		const { results, total_pages, page, total_results } = await searchAPIData();

		global.search.page = page;
		global.search.totalPages = total_pages;
		global.search.totalResults = total_results;

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		displaySearchResults(results);

		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please enter a search term');
	}
}

// Display Search Results
function displaySearchResults(results) {
	// Clear previous results
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';

	results.forEach((result) => {
		// For actors

		const div = document.createElement('div');
		div.classList.add('card');

		if (global.search.type === 'movie' || global.search.type === 'tv') {
			div.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
               ${
									result.poster_path
										? `<img
                  src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                  class="card-img-top"
                  alt="${
										global.search.type === 'movie' ? result.title : result.name
									}" 
               />`
										: `<img
               src="images/no-image.jpg"
               class="card-img-top"
               alt="${
									global.search.type === 'movie' ? result.title : result.name
								}"  />`
								}
            
            <div class="card-body">
               <h5 class="card-title">${
									global.search.type === 'movie' ? result.title : result.name
								}</h5>
               <p class="card-text">
                  <small class="text-muted">Release: ${
										global.search.type === 'movie'
											? result.release_date
											: result.first_air_date
									}</small>
               </p>
            </div>
				</a>`;
		} else if (global.search.type === 'person') {
			// Handle actors
			if (result.known_for_department !== 'Acting') return;

			const movie_title = result.known_for.map(
				(movie) => movie.title || movie.name
			);

			div.innerHTML = `
            <a href="actor-details.html?id=${result.id}">
               ${
									result.profile_path
										? `<img
                  src="https://image.tmdb.org/t/p/w500/${result.profile_path}"
                  class="card-img-top"
                  alt="${result.name}" 
               />`
										: `<img
               src="images/no-image.jpg"
               class="card-img-top"
               alt="${result.name}"  />`
								}
            
            <div class="card-body">
               <h5 class="card-title">${result.name}</h5>
               <p class="card-text">
                  <small class="text-muted"> ${movie_title.join(' | ')}</small>
               </p>
            </div>
				</a>`;
		}

		document.querySelector('#search-results-heading').innerHTML = `
				<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
		`;

		document.querySelector('#search-results').appendChild(div);
	});

	displayPagination();
}

// Create & Display Pagination for Search
function displayPagination() {
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
	<button class="btn btn-primary" id="prev">Prev</button>
	<button class="btn btn-primary" id="next">Next</button>
	<div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
		  `;

	document.querySelector('#pagination').appendChild(div);

	// Disable prev button if on first page
	if (global.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	}

	// Disable next button if on last page
	if (global.search.page === global.search.totalPages) {
		document.querySelector('#next').disabled = true;
	}

	// Next page
	document.querySelector('#next').addEventListener('click', async () => {
		global.search.page++;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
		window.scrollTo(0, 320);
	});

	// Prev page
	document.querySelector('#prev').addEventListener('click', async () => {
		global.search.page--;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
		window.scrollTo(0, 320);
	});
}

// Display Slider Movies
async function displaySlider() {
	// If Now Playing is active, display Now Playing Movies
	if (
		document
			.querySelector('.header-wrapper .now-playing')
			.classList.contains('active')
	) {
		document.querySelector('.swiper-wrapper').innerHTML = '';
		const { results } = await fetchAPIData('movie/now_playing');

		results.forEach((movie) => {
			const div = document.createElement('div');
			div.classList.add('swiper-slide');

			div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
				<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
				movie.title
			}"/>
				<h4 class="swiper-rating">
					<i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
				</h4>
			</a>`;

			document.querySelector('.swiper-wrapper').appendChild(div);
		});

		initSwiper();
	} else {
		// Else, display Upcoming Movies
		document.querySelector('.swiper-wrapper').innerHTML = '';
		const { results } = await fetchAPIData('movie/upcoming');

		results.forEach((movie) => {
			const div = document.createElement('div');
			div.classList.add('swiper-slide');

			div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
				<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
				<h4 class="swiper-rating">
					${movie.release_date}
				</h4>
			</a>`;

			document.querySelector('.swiper-wrapper').appendChild(div);
		});
		initSwiper();
	}
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 5,
			},
		},
	});
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
	// Register your key at https://www.themoviedb.org/settings/api and enter here
	// Only use this for development or very small projects. You should store your key and make requests from a server.
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();

	const response = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&region=US`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

// Make Request to Search
async function searchAPIData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();

	const response = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

// Hightlight active link
function highlightActiveLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (link.getAttribute('href') === global.currentPage) {
			link.classList.add('active');
		} else if (global.currentPage === '/index.html') {
			document.querySelector('.nav-link').classList.add('active');
		}
	});
}

// Show Alert
function showAlert(message, className = 'error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.appendChild(document.createTextNode(message));
	document.querySelector('#alert').appendChild(alertEl);

	setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Init App
function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displaySlider();
			displayPopularMovies();
			break;
		case '/shows.html':
		case '/shows':
			displayPopularShows();
			break;
		case '/actors.html':
		case '/actors':
			displayPopularActors();
			break;
		case '/movie-details.html':
		case '/movie-details':
			displayMovieDetails();
			break;
		case '/tv-details.html':
		case '/tv-details':
			displayShowDetails();
			break;
		case '/actor-details.html':
		case '/actor':
			displayActorDetails();
			break;
		case '/search.html':
		case '/search':
			search();
			break;
	}

	highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
