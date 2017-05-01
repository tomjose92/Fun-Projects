export const getEpisodesWidth = () => {
	let width=800,
    modal = document.getElementsByClassName('tvShowModal')[0];
    if(modal===undefined)
    {
      return width;
    }
    let modalWidth = modal.getBoundingClientRect().width;
    width = Math.min(width, modalWidth - 110);
    return width;
}

export const getModalMesaures = () => {
    let documentWidth = document.documentElement.clientWidth;
    let noOfShows = Math.floor(documentWidth/300);
    let width = noOfShows*250 + (noOfShows)*20;
    return {width};
}

export const blurImage = (val) => {
  let modal = document.getElementById('modal_image');
  if(!modal)
  {
    return;
  }
  
	if(val)
	{
		modal.classList.add('blur');
	}
	else
	{
		modal.classList.remove('blur')
	}
}