// $("#formsub").ajaxSubmit({url: 'http://localhost:8080/login', type: 'post'})
$(document).ready(function() {
  $("#login_form").submit(function() {
    // alert("rom " + $("#usernamesignup").val());
    if ($("#emaillogin").val() && $("#passwordlogin").val())
    {
      $.ajax({
        type: "POST",
        url: 'http://localhost:8080/login',
        data: {
          email: $("#emaillogin").val(),
          password: $("#passwordlogin").val()
        },
        success: function(data) {
          if (data  == 'success') {
            window.location.replace("/home");
          }
          else
          {
            alert(data);
            window.location.replace("/login");
          }
        },
        error: function(err, status, errorThrown) {
          console.log(err);
          console.log(status);
          console.log(errorThrown);
        }
      });
    }
    return false;
  });
});
