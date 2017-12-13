<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Facebook Events Importer</title>
    <!-- Bootstrap -->
    <link href="bootstrap-3.3.7-dist/css/bootstrap.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    <!-- <script src="bootstrap-3.3.7-dist/js/npm.js"></script> -->
    <!-- Custom style -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Google fonts -->
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,400italic,500,500italic,700,700italic,900,300,300italic' rel='stylesheet' type='text/css'>
    <link href="css/bootstrap-datepicker.css" rel="stylesheet">
    <!-- Font awesome -->
    <script src="https://use.fontawesome.com/6d62c84616.js"></script>
    <script src="js/fb.js"></script>
    <script src="js/script.js"></script>
    <script src="js/bootstrap-datepicker.js"></script>
    <script src="http://maps.googleapis.com/maps/api/js?extension=.js&output=embed"></script>
</head>

<body>
    <div class="container-fluid">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <!--  <a class="navbar-brand" href="#"> </a>-->
                    
                    
                    <img class="img img-responsive logo-img" src="facebook_places_logo_2011.png" alt="">
                    
                    
                    
                    
                    </div>
                <div class="collapse navbar-collapse" id="myNavbar">
                     <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Help</a></li>
                        <!-- 
                        <li><a href="#">Subscribe</a></li>
                        <li><a href="#">Share event or Place</a></li> -->
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <!-- <li class="list-image"><img class="img img-circle img-responsive" src="http://www.corporatetraveller.ca/assets/images/profile-placeholder.gif" alt=""></li> -->
                        <li class="list-image fbSignInBtn"><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i> Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    <div class="container-fluid main-wrapper">
        <div class="col-xs-12 col-sm-4 col-md-4 main-panel-wrapper">
            <div class="panel-group">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
        <a data-toggle="collapse" href="#collapse1"   ><span class="glyphicon glyphicon-search"></span> Search</a>
      </h4> </div>
                    <div id="collapse1" class="panel-collapse collapse">
                        <div class="panel-body">
                            <form role="form" id="search-form" action="#">
                                <div class="form-group">
                                    <input type="text" class="main-search form-control" id="search" placeholder="Search..."><a class="search-options-link" data-toggle="collapse" href="#demo"><span data-toggle="tooltip" data-placement="left" title="Search options"  class="glyphicon glyphicon-cog"></span></a></div>                                
                                    <div class="col-xs-12 col-sm-12 col-md-12 search-options-wrapper collapse" id="demo">
                                        <div class="col-xs-12">
                                            <div class="col-xs-6 col-sm-3 col-md-3">
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="selectType" value="event" checked="checked">Events</label>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3 col-md-3">
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="selectType" value="place">Places</label>
                                                </div>
                                            </div>
                                            <div class="event-suggestion-filter col-xs-12 col-sm-6 col-md-6">
                                            <select class="form-control" id="suggestions">
		                                            <option value="recommended">Suggested</option>
		                                            <option value="score">What We Say</option>
		                                            <option value="attending">Most Attended</option>
		                                        </select>                      
                                        </div>                                                                             
                                        <div class="col-xs-12 event-date-filter">
	                                        <div class="col-xs-12 col-sm-6 col-md-6">
		                                        <select class="form-control" id="selectDay">
		                                            <option value="today">Today</option>
		                                            <option value="tomorrow">Tomorrow</option>
		                                            <option value="this week">This week</option>
		                                            <option value="this weekend">This weekend</option>
		                                        </select>
	                                        </div>
                                        </div>
                                        <div class="col-xs-12 event-date-filter">   
                                            <div class="col-xs-6">
                                                <div class="form-group date-entry">
                                                    <label for="usr">From:</label>
                                                    <input type="text"  class="form-control start-date"> </div>
                                            </div>
                                            <div class="col-xs-6">
                                                <div class="form-group date-entry">
                                                    <label for="usr">To:</label>
                                                    <input type="text" class="form-control end-date"> </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button id="search-btn" type="submit" class="btn btn-success pull-right"><span class="glyphicon glyphicon-ok"></span>Submit</button>
                                <button class="btn btn-danger pull-right" data-toggle="collapse" href="#collapse1" style="margin-right: 10px;"><span class="glyphicon glyphicon-remove"></span>Close</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
			<div id="eventList">
				<div class="event-list">
					<div id="loader"></div>
				</div>
				<div class="pull-right" id="NavTab"></div>
			</div>
			<div class="modal fade" id="myModal" role="dialog" aria-hidden="true">
			    <div class="modal-dialog">
			        <div class="modal-content">
			            <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">×</button> </div>
			             <div class="modal-body"><div id="loader"></div></div>
			        </div>
			    </div>
		    </div>
		</div>
        <div class="col-xs-12 col-sm-8 col-md-8 google-maps">
        <div id="map-canvas">         
            </div>
            <style>
                .google-maps {
                    position: relative;
                    height: 100vh;
                    overflow: hidden;
                }
                
                #map-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100% !important;
                    height: 100vh !important;
                }
            </style>
        </div>
    </div>
    <!-- Tooltips -->
    
    <script>
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    </script>
</body>

</html>
