var express = require('express');
var router = express.Router();

// logout
router.get('/',checkAdmin, function(req, res, next) {
	if(req.session.user)
	{
		req.session.destroy();
		res.redirect('/');// chemain absolu (racine)
	}else{
		res.redirect('/');
	}
});

// ::: check admin :::
function checkAdmin(req,res,next) {
  if(req.session.admin)
  {
  	req.session.destroy();
    res.redirect('/admin_manage');
  }else{
    next();
  }
}

module.exports = router;
