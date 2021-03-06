//var Blockchain = chrome.extension.getBackgroundPage().Blockchain;
var Util = chrome.extension.getBackgroundPage().Util; 
var Gox = chrome.extension.getBackgroundPage().Gox;

angular.module('controllers', [])

	.controller('PopupCtrl', function PopupCtrl($scope) {
		// Use settings.currency
		$scope.currency = localStorage.getItem('currency') || 'USD';
	})

	/*
	.controller('BlockchainCtrl', function($scope) {
		var currency = 'USD';
		var currency_expanded = null;

		$scope.data = Blockchain.data;
		$scope.old_data = Blockchain.old_data;

		$scope.getCurrentPrice = function() {
			var data = $scope.data[currency];
			return data ? (data.symbol + data.last) : '-';
		}
		$scope.getValueChangeClass = function(currency, type) {
			if (!$scope.data[currency] || !$scope.old_data[currency])
				return '';
			var old_price = $scope.old_data[currency][type];
			var new_price = $scope.data[currency][type];
			if (new_price > old_price)
				return 'up';
			else if (new_price < old_price)
				return 'down';
			else
				return '';
		}
		$scope.getValueMajor = function(value) {
			return value - value%1;
		}
		$scope.getValueMinor = function(value) {
			return (Math.round(value%1*100000)/100000).toString().substr(1,6) || '.';
		}
		$scope.getValueZeroes = function(value) {
			return "00000".substr(0,6-$scope.getValueMinor(value).length);
		}
		$scope.toggleExpanded = function(currency) {
			if (currency == currency_expanded) {
				this.data[currency].expanded = !this.data[currency].expanded;
			}
			else {
				if (currency_expanded)
					this.data[currency_expanded].expanded = false;
				this.data[currency].expanded = true;
				currency_expanded = currency;
			}
		}
		$scope.refresh = function() {
			Blockchain.poll();
		}

		chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
			if (request == 'update') {
				Util.log('update', $scope.data);
				$scope.$apply();
			}
		});
	})
	*/

	.controller('GoxCtrl', function($scope, $element) {

		$scope.status_text = null;
		$scope.ticker_data = Gox.ticker_data;

		$scope.getConnectionStatus = function() {
			return Gox.getConnectionStatus();
		}
		$scope.getConnectionStatusEq = function(status) {
			return Gox.getConnectionStatus() == status;
		}

		$scope.currentPrice = function() {
			return $scope.ticker_data[Gox.currency] && $scope.ticker_data[Gox.currency].last.display_short;
		}
		$scope.priceDirection = function() {
			return $scope.ticker_data[Gox.currency] && $scope.ticker_data[Gox.currency].last.change;
		}

		$scope.$watch('getConnectionStatus()', function(new_val, old_val) {
			var text_el = $element.find('.status .text.' + new_val);
			// Fade out when new_val=='open' && old_val != 'open' && old_val != ''
		});

		chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
			switch(request.type) {
				case 'countdown':
					$scope.retry_time = request.countdown;
					break;
			}
			$scope.$apply();
		});
	})

angular.module('BitAwesomeApp', ['controllers']);

