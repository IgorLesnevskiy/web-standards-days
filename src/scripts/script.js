(function(document){

	// More

	var more = document.getElementById('more');

	if (more) {
		more.addEventListener('click', function() {
		    var speakers = more.parentNode.querySelectorAll('.speakers__speaker--hidden'),
			    group = 20;

		    if (speakers.length) {
		        for (var i = 0, l = Math.min(speakers.length, group); i < l; i++) {
		            var speaker = speakers[i],
		            	picture = speaker.querySelector('.speakers__picture'),
		            	data = picture.dataset.src;

		            if (data) {
		                picture.src = data;
		            }

		            speaker.classList.remove('speakers__speaker--hidden');
		        }

		        if (speakers.length <= group) {
		            more.parentNode.removeChild(more);
		        }
		    }
		});

	}

})(document);

// Maps

function getMapData() {
	var map = document.getElementById('map');
	var src = map.firstChild.src.split('?')[1].split('&');
	var data = {
		map: map
	};

	for (var i = 0; i < src.length; i++) {
		var item = src[i].split('=');
		data[item[0]] = item[1];
	}

	return data;
}

function yandexMap() {
	var data = getMapData();

	data.ll = data.ll.split(',');
	data.latitude = parseFloat(data.ll[0]);
	data.longitude = parseFloat(data.ll[1]);
	data.zoom = parseFloat(data.z);

	var coordinates = [
		data.longitude,
		data.latitude
	];

	var map = new ymaps.Map('map', {
		center: coordinates,
		zoom: data.zoom
	});

	map.behaviors.disable('scrollZoom');
	map.geoObjects.add(
		new ymaps.Placemark(coordinates, {}, {
		iconLayout: 'default#image',
		iconImageHref: '/images/icon.svg',
		iconImageSize: [80, 87],
		iconImageOffset: [-40, -95]
	}));

	data.map.classList.add('map--yandex');
	data.map.removeChild(data.map.firstChild);
}

function googleMap() {
	var data = getMapData();

	data.center = data.center.split(',');
	data.latitude = parseFloat(data.center[0]);
	data.longitude = parseFloat(data.center[1]);
	data.scale = parseFloat(data.scale);
	data.zoom = parseFloat(data.zoom);

	var coordinates = {
		lat: data.latitude,
		lng: data.longitude
	};

	var map = new google.maps.Map(data.map, {
		zoom: data.zoom,
		center: coordinates
	});

	var marker = new google.maps.Marker({
		position: coordinates,
		icon: {
			url: '/images/icon.svg',
			size: new google.maps.Size(80, 87),
			scaledSize: new google.maps.Size(80, 87),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(40, 87)
		},
		map: map
	});

	data.map.classList.add('map--google');
}

// Iframe lazy loading

(function(document){
	setupVideoPreload();

	function setupVideoPreload() {
		var videoElements = document.querySelectorAll('.video');

		videoElements.forEach(preloadVideo);
	}

	function preloadVideo(videoElement) {
		var playButton = videoElement.querySelector('.video__icon');
		var cover = videoElement.querySelector('.video__media');
		var videoId = parseCoverURL(cover);
		var videoWrapper = videoElement.querySelector('.video__wrapper');

		playButton.addEventListener('click', function() {
			var iframe = makeIframe(videoId);

			videoWrapper.innerHTML = '';
			videoWrapper.appendChild(iframe);
		});
	}

	function parseCoverURL(coverElement) {
		var urlRegExp = /https:\/\/img\.youtube\.com\/vi\/([a-z0-9_]+)\/mqdefault\.jpg/i;
		var url = coverElement.src;
		var match = url.match(urlRegExp);

		return match[1];
	}

	function makeIframe(videoId) {
		var iframe = document.createElement('iframe');

		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('src',  generateIframeUrl(videoId));
		iframe.classList.add('video__iframe');

		return iframe;
	}

	function generateIframeUrl(videoId) {
		var query = '?rel=0&showinfo=0&autoplay=1';

		return 'https://www.youtube.com/embed/' + videoId + query;
	}
})(document);
