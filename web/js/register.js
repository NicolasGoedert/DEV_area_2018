// $("#formsub").ajaxSubmit({url: 'http://localhost:8080/login', type: 'post'})
$(document).ready(function() {
  $("#register_form").submit(function() {
    // alert("rom " + $("#usernamesignup").val());
    if ($("#usernamesignup").val() && $("#emailsignup").val() && $("#passwordsignup").val() && $("#passwordsignup_confirm").val())
    {
      $.ajax({
        type: "POST",
        url: 'http://localhost:8080/register',
        data: {
          username: $("#usernamesignup").val(),
          email: $("#emailsignup").val(),
          password: $("#passwordsignup").val(),
          password_confirm: $("#passwordsignup_confirm").val()
        },
        success: function(data) {
          if (data  == 'success') {
            window.location.replace("/home");
          }
          else
          {
            alert(data);
            window.location.replace("/");
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
