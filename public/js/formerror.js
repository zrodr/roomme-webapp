const errMsg = document.getElementById('err')
      
if(errMsg) {
  errMsg.style.backgroundColor = '#f8d7da'
  errMsg.style.color = '#752129'
  errMsg.style.width = '200px'
  errMsg.style.margin = 'auto'
  errMsg.style.marginTop = '10px'
  errMsg.style.borderRadius = '10px'

  const fade = setInterval(()=> {
    errMsg.style.opacity -= 0.05

    if(errMsg.style.opacity < 0.0) {
      clearInterval(fade)
      errMsg.remove()
    }
  }, 5000)
}