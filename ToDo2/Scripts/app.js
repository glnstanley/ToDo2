var todoApp = angular.module('todoApp', ['ngRoute','ngResource']);

todoApp.config(function ($routeProvider) {
    $routeProvider
        //  localhost:port/index.html#/x
        .when('/', { controller: 'ListCtrl', templateUrl: 'list.html' })
        .when('/edit/:editId', { controller: 'EditCtrl', templateUrl: 'details.html' })
        .when('/new', { controller: 'NewCtrl', templateUrl: 'details.html' })
        .when('/hw', { controller: 'ListCtrl', template: 'Hello World! {{msg}}' })
        .otherwise({ redirectTo: '/' });
});

todoApp.directive('dgreet', function () {
    return {
        template: '<h2>Greetings from {{from}} to {{to}}!</h2>', // $scope.from & $scope.to
        controller: function ($scope, $element, $attrs) {
            $scope.from = $attrs.from;
            $scope.to = $attrs.dgreet;
        }
    }
});


todoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

todoApp.controller('EditCtrl', function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.item = Todo.get({ id: id });

    $scope.save = function () {
        Todo.update({ id: id }, $scope.item, function () {
            $location.path('/');
        });
    };
});

todoApp.controller('NewCtrl', function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
});

todoApp.controller('ListCtrl', function ($scope, $location, Todo) {
  //  $scope.todos = TodoQ.query(); //array of todos
    $scope.msg = "testing...";

    $scope.search1 = function () {
        $scope.todos = Todo.query({ sort: $scope.sort_order, desc: $scope.is_desc });  //array of todos
    };

    $scope.search = function(){
        Todo.query({ q: $scope.query, sort: $scope.sort_order, desc: $scope.is_desc, offset: $scope.offset, limit: $scope.limit }, function (data) {
            $scope.sort_cnt += data.length;
            $scope.has_more = data.length === $scope.limit;
            $scope.todos = $scope.todos.concat(data);
        });
    };

    $scope.search3 = function () {
        $scope.todos = Todo.query({ sort: $scope.sort_order, desc: $scope.is_desc, offset: 0, limit: $scope.sort_cnt });
    };
    
    $scope.sort = function (col) {
        if ($scope.sort_order == col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.sort_order = col;
        $scope.search3();
    };

    $scope.delete = function () {
        var id = this.todo.Id;
        Todo.delete({ id: id }, function () {
            $('#todo_' + id).fadeOut();
        });
    };

    $scope.sort_order = "Priority";
    $scope.is_desc = false;

    $scope.reset = function () {
        $scope.has_more = false;
        $scope.sort_cnt = 0;
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.todos = [];
        $scope.search();
    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.reset();
});
