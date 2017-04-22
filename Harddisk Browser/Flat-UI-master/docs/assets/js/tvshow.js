// Some general UI pack related JS
// Extend JS String with repeat method
(function ($) {
	$('.fui-radio-checked').removeClass('fui-radio-checked').addClass('fui-radio-unchecked');
 	  $('.tvshow').click(function(){
      var image = $(this).attr("name");
      var tvshow = $(this).parent('div');
 		  $('.fui-radio-checked').removeClass('fui-radio-checked').addClass('fui-radio-unchecked');	
 		  $('.episodescroll').hide();
 		  if(tvshow.find('.season').length==0)
      {
        if(tvshow.find('.episodescroll').attr('SHOW_EPISODES')==null)
        {
          $('.episodescroll').attr('SHOW_EPISODES',null);
          $('.season').parent('div').hide();
          $('body').attr("class","").addClass(image);    
          tvshow.find('.episodescroll').show(); 
          tvshow.find('.episodescroll').attr('SHOW_EPISODES','true');
        }
        else
        {
          tvshow.find('.episodescroll').hide();
          $('.episodescroll').attr('SHOW_EPISODES',null);
          $('.season').parent('div').hide();
          $('body').attr("class","").addClass("mediaBG");
        }
      }
      else
      {

 		    if(tvshow.find('.season').parent('div').css('display')=='block')
 		    {
 			    $('.season').parent('div').hide();
          $('body').attr("class","").addClass("mediaBG");
 		    }
 		    else
 		    {
          $('.episodescroll').attr('SHOW_EPISODES',null);
    		  $('.season').parent('div').hide();
    		  tvshow.find('.season').parent('div').show();
          $('body').attr("class","").addClass(image);    
    	  }
      }
  	});

  	$('.season').click(function(){
  		$('.episodescroll').hide();
      var season = $(this).parent('div');
  		if(season.hasClass('fui-radio-checked'))
  		{
  			$('.fui-radio-checked').removeClass('fui-radio-checked').addClass('fui-radio-unchecked');	
  		}
  		else
  		{
  			$('.fui-radio-checked').removeClass('fui-radio-checked').addClass('fui-radio-unchecked');	
  			season.removeClass('fui-radio-unchecked').addClass('fui-radio-checked');
	    	season.find('.episodescroll').show();
  		}
  	});

})(jQuery);
