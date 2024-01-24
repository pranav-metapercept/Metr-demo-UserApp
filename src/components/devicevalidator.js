import Swal from "sweetalert2";

function devicevalidator(res) {
  if (res === "Another device has login with your account!") {
    let timerInterval;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary btn-sm mr-2",
        cancelButton: "btn btn-light btn-sm",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `${res}`,
        html: "You will redirected to login page <b></b> milliseconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
        
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      })
      .then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          localStorage.clear();
          window.location.href = "/";
        }
      });
  }
}
export default devicevalidator;
  