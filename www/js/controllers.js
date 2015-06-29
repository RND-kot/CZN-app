
transliterate = (function() {
    var
      rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
      eng = "shh sh ch c  yu ya yo zh `` y` e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
    ;
    return function(text, engToRus) {
      var x;
      for(x = 0; x < rus.length; x++) {
        text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
        text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase()); 
      }
      return text;
    }
  })();

var keyname = "job";

function SearchCtrl($rootScope,$scope,$http,$ionicLoading){
      
  
  $ionicLoading.show({
  templateUrl: 'loading.html',
  scope: $scope
  });
 
  $scope.hide = function(){
  $ionicLoading.hide();
  };

  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $http.post("http://czn-shakhty.ru/server_request_group.php")
  .success(function(response) { 
    $scope.grafs = response.grafs;
    $scope.groups = response.groups;
    $scope.hide(); 
  });
  
$scope.searchpar = function(fee, keyword, group, graf) {

    $ionicLoading.show({
        templateUrl: 'loading.html',
        scope: $scope
    });

    if (keyword != null && keyword !== undefined) {
        keyword = transliterate(keyword);
    } else {
        keyword = "";
    }
    if (group != null && group !== undefined) {
        group = transliterate(group);
    } else {
        group = "";
    }
    if (graf != null && graf !== undefined) {
        graf = transliterate(graf);
    } else {
        graf = "";
    }

    $http({
        method: 'POST',
        url: 'http://czn-shakhty.ru/server_request.php',
        data: {tar: fee, name_prof: keyword, group: group, graf: graf}
    })
        .success(function (response) {
            $rootScope.worker = response.jobs;
            $scope.hide();
        });
};
}

function PlaylistsCtrl($scope,localStorageService) {
    $scope.localjobs = localStorageService.get(keyname);
    $scope.clearlocal = function(){
    localStorageService.clearAll();
    $scope.localjobs =localStorageService.get(keyname) ;
};

}

function PlaylistCtrl($scope,$rootScope,localStorageService,$stateParams,$filter) {

    $scope.linkopen=function(www){
   window.open(www, '_system');

    };

    var singlenum = $stateParams.playlistId;
    var localjob = localStorageService.get(keyname);
    if (localjob == undefined) {localjob = [];}
    var Num = localjob.Num;
    localjob = $filter('filter')(localjob,{Num:singlenum})[0];
    $scope.vacan = localjob;
    if ($rootScope.worker){
        var vacs = $rootScope.worker;
        var filterjob = $filter('filter')(vacs,{ Num: singlenum })[0];
        $scope.vacan = filterjob;
        var responceArr = [filterjob];
        if (localStorageService.get(keyname)) {var arr = localStorageService.get(keyname);} else {var arr = [];}
        localStorageService.set(keyname,responceArr.concat(arr));
        responceArr =[];
    };
}


function AppCtrl($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}

angular
.module('starter.controllers', ['LocalStorageModule'])

    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('WorkL');

    })

.controller('AppCtrl', AppCtrl)

.controller('SearchCtrl' , SearchCtrl)

.controller('PlaylistsCtrl' , PlaylistsCtrl)

.controller('PlaylistCtrl' , PlaylistCtrl);
