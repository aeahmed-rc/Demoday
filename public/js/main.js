
const btn=document.querySelectorAll(".commentButton")

Array.from(btn).forEach(function(element) {
      element.addEventListener('click', function(){

        const question = this.parentNode.childNodes[1].innerText
        console.log(question)
        const comment = document.querySelector('.commentInput').value
        console.log(this.parentNode.childNodes[3]);
        console.log(this)
        console.log(this.parentNode.childNodes[3].value)
        console.log("comment",comment)

        fetch('/questions', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'question': question,
            'comment':comment,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
