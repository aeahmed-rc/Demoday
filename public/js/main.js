
const btn=document.querySelectorAll(".commentButton");
const question = document.querySelectorAll('.postTitle');
const comment = document.querySelectorAll('.commentInput');
const thumbsUp = document.querySelectorAll('.thumbsUp')
const thumbsdwn = document.querySelectorAll('.thumbsDown')
const deletes=document.querySelectorAll(".delete")
console.log(deletes)



for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', () => {
        fetch('questions', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'question': question[i].innerHTML,
            'comment':comment[i].value,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
    })
};

for (let j = 0; j < thumbsUp.length; j++) {
    thumbsUp[j].addEventListener('click', () => {
      const thumbsUp=document.querySelectorAll(".result")
      console.log("about to thumbup",thumbsUp)
        fetch('thumbsUps', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'question': question[j].innerHTML,
            'comment':comment[j].value,
            'thumbsUp': thumbsUp[j].innerHTML
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log("response from server thumbsup",data)
          window.location.reload(true)
        })
    })
};

for (let j = 0; j < thumbsdwn.length; j++) {
    thumbsdwn[j].addEventListener('click', () => {
      const thumbsUp=document.querySelectorAll(".result")
      console.log("about to thumbsdwn",thumbsUp, thumbsUp[j].innerHTML)

        fetch('thumbsdwn', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'question': question[j].innerHTML,
            'comment':comment[j].value,
            'thumbsUp': thumbsUp[j].innerHTML

          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log("response from server thumbsdwn",data)
          window.location.reload(true)
        })
    })
};



for(let i=0;i< deletes.length;i++){
  deletes[i].addEventListener('click', function(){

    fetch('delete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'question': question[i].innerHTML,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
}
