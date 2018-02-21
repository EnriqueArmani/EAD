
      $(document).ready(function(){
          tinymce.init({
    selector: '#postContent'
  });

//$('#post-title-field').keyup(function() {
//    $('#post-slug-field').attr("placeholder","/posts/" + $('#post-title-field').val().replace(/\s+/g, '-'));
//})
         /* $('#post-slug-field').on("input", function() {
              $('#post-slug-field').val("/posts/" + return val);
          })
           $("new-post").submit(function(event){
      $('#post-slug-field').val().slice(6);
      })*/$('#post-title-field').val("<%= postTitle %>");
          $('#post-slug-field').val("<%= postSlug %>");
          $('#postContent').val("<%= postSlug %>");
      });