var app = (function () {
	// Application object.
	var app = {};

	// Dictionary of beacons.
	var beacons = {};
	

	// Timer that displays list of beacons.
	var updateTimer = null;

	var api = "https://api.nasa.gov/planetary/apod?api_key=brGw4pKxD6lF1hb6V1ivnldKOn8EQKU1vqYbqHmf";

	app.initialize = function () {
		document.addEventListener(
			'deviceready',
			function () { evothings.scriptsLoaded(onDeviceReady) },
			false);
	};

	function onDeviceReady() {
		// Start tracking beacons!
		setTimeout(startScan, 300);


		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 300);
	}

	function startScan() {
		// Called continuously when ranging beacons.
		evothings.eddystone.startScan(
			function (beacon) {
				// Insert/update beacon table entry.
				beacon.timeStamp = Date.now();
				beacons[beacon.address] = beacon;
			},
			function (error) {
				console.log('Eddystone Scan error: ' + JSON.stringify(error));
			});
		return beacons;
	}

	/**
	 * Map the RSSI value to a value between 1 and 100.
	 */
	function mapBeaconRSSI(rssi) {
		if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
		if (rssi < -100) return 0; // Max RSSI
		return 100 + rssi;
	}

	function getSortedBeaconList(beacons) {
		var beaconList = [];
		for (var key in beacons) {
			beaconList.push(beacons[key]);
		}
		beaconList.sort(function (beacon1, beacon2) {
			return mapBeaconRSSI(beacon1.rssi) < mapBeaconRSSI(beacon2.rssi);
		});
		return beaconList;
	}

	function displayBeaconList() {
		// Clear beacon display list.
		$('#found-beacons').empty();

		// Update beacon display list.
		var timeNow = Date.now();
		var found = false;
		$.each(getSortedBeaconList(beacons), function (index, beacon) {
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 10000 > timeNow) {
				// Create HTML to display beacon data.
				var element = $(
					'<li>'
					+ htmlProduct(beacon)
					+ '</li>'
				);

				$('#message').text('');
				$('#found-beacons').append(element);
				found = true;
			}
		});
		if (!found) {
			$('#message').text('No advertisements nearby.');
		}
	}

	function htmlProduct(beacon) {
		var url = beacon.url;
		var producthtml = "";
		var productName = "";
		var productThumb = "";
		var htmlstr = "";
		if (url == "https://goo.gl/FNVtDm") {
			productName = "Amadana MASTER'S DREAM本格ビアサーバー";
			productThumb = "ui/images/product1/thumbnai.jpg";
			producthtml = "product1.html";
		} else if (url == "https://goo.gl/LmqNsg") {
			productName = "Amadana USBスピーカー";
			productThumb = "ui/images/product2/thumpnai.jpg";
			producthtml = "product2.html";
		} else if (url == "https://goo.gl/VOspvM") {
			productName = "SALヘッドホン(マイク付き）B";
			productThumb = "ui/images/product3/thumpnai.jpg";
			producthtml = "product3.html";
		}

		if (producthtml) {
			htmlstr = '<h3>' + productName + '</h3>'
				+ '<img src="' + productThumb + '"/>'
				+ '<table style="width:100%" align="center"><tr><th>'
				+ '<a class="button--large" href="' + producthtml + '">Buy it</a>';
			+ '</th></tr></table>';
			return htmlstr;
		}
	}

	function htmlBeaconName(beacon) {
		return beacon.name ?
			'<strong>' + beacon.name + '</strong><br/>' : '';
	}

	function htmlBeaconURL(beacon) {
		return beacon.url ?
			'URL: ' + beacon.url + '<br/>' : '';
	}

	function htmlBeaconNID(beacon) {
		return beacon.nid ?
			'NID: ' + uint8ArrayToString(beacon.nid) + '<br/>' : '';
	}

	function htmlBeaconBID(beacon) {
		return beacon.bid ?
			'BID: ' + uint8ArrayToString(beacon.bid) + '<br/>' : '';
	}

	function htmlBeaconVoltage(beacon) {
		return beacon.voltage ?
			'Voltage: ' + beacon.voltage + '<br/>' : '';
	}

	function htmlBeaconTemperature(beacon) {
		return beacon.temperature && beacon.temperature != 0x8000 ?
			'Temperature: ' + beacon.temperature + '<br/>' : '';
	}
	function htmlBeaconTxPower(beacon) {
		return beacon.txPower ?
			'TxPower: ' + beacon.txPower + '<br/>' : '';
	}

	function htmlBeaconAdvCnt(beacon) {
		return beacon.adv_cnt ?
			'ADV_CNT: ' + beacon.adv_cnt + '<br/>' : '';
	}

	function htmlBeaconDsecCnt(beacon) {
		return beacon.dsec_cnt ?
			'DSEC_CNT: ' + beacon.dsec_cnt + '<br/>' : '';
	}

	function htmlBeaconRSSI(beacon) {
		return beacon.rssi ?
			'RSSI: ' + beacon.rssi + '<br/>' : '';
	}

	function htmlBeaconRSSIBar(beacon) {
		return beacon.rssi ?
			'<div style="background:rgb(255,64,128);height:20px;width:'
			+ mapBeaconRSSI(beacon.rssi) + '%;"></div>' : '';
	}

	function uint8ArrayToString(uint8Array) {
		function format(x) {
			var hex = x.toString(16);
			return hex.length < 2 ? '0' + hex : hex;
		}

		var result = '';
		for (var i = 0; i < uint8Array.length; ++i) {
			result += format(uint8Array[i]) + ' ';
		}
		return result;
	}

	return app;
})();

app.initialize();


function onConfirm() {
    document.getElementById("tryBtn").disabled = true;
}


function showMessage() {
	navigator.notification.alert(
		"The product is highlight on the shelf!",    // message
		onConfirm,   // callback
		"Try product",      // title
		"Tried"  // buttonName
	);
}

function setOrder(name) {
	var product = {};
	if (name == "product1") {
		product = { name: "Amadana MASTER'S DREAM本格ビアサーバー", price: 32400, quality: 1 };
	} else if (name == "product2") {
		product = { "name": "Amadana USBスピーカー", "price": 16200, quality: 1 };
	} else if (name == "product3") {
		product = { "name": "SALヘッドホン(マイク付き）B", "price": 10301, quality: 1 };
	}
	var orderItems = JSON.parse(window.localStorage.getItem('orderItems'));
	if (!orderItems) {
		orderItems = [product];
		window.localStorage.setItem('orderItems', JSON.stringify(orderItems));
	} else {

		if (containsObject(product, orderItems)) {
			var newq = getQuality(orderItems, product.name) + 1;
			changeQuality(orderItems, product.name, newq);
		} else {
			orderItems.push(product);
		}
		window.localStorage.setItem('orderItems', JSON.stringify(orderItems));
	}
	window.location.href = "order.html";
}

function containsObject(obj, list) {
	var result = false;
	$.each(list, function () {
		if (this.name == obj.name) {
			result = true;
		}
	});
	return result;
}

function getQuality(items, name) {
	var result = 0;
	$.each(items, function () {
		if (this.name == name) {
			result = this.quality;
		}
	});
	return result;
}

function changeQuality(items, name, q) {
	$.each(items, function () {
		if (this.name == name) {
			this.quality = q;
		}
	});
}

function pay() {
	window.localStorage.removeItem("orderItems");
	window.location.href = "delivery.html";
}

function displayOrder() {
	var orderItems = JSON.parse(window.localStorage.getItem('orderItems'));
	var total = 0;

	$.each(orderItems, function () {
		total = total + this.quality * this.price;
		var element = $(
			'<li>'
			+ htmlOrder(this)
			+ '</li>'
		);
		$('#orders').append(element);
	});
	$('#total').text(total);
}

function htmlOrder(order) {
	return '<strong>' + order.quality + ' x ' + order.name + '</strong>';
}