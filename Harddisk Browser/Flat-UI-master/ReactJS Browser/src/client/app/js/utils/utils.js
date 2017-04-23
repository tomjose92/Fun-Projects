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
    let documentWidth = document.documentElement.clientWidth,
    tvShows = document.getElementsByClassName('tvshow'),
    width=0,marginLeft;
    for(let i=0;i<tvShows.length;i++)
    {
      let tvShow = tvShows[i];
      let tvShowRight = tvShow.getBoundingClientRect().right;
      let tvShowLeft = tvShow.getBoundingClientRect().left;
      if(i==0)
      {
        marginLeft=tvShowLeft;
      }

      if(tvShowRight - marginLeft > width)
      {
        width = tvShowRight - marginLeft;
      }
    }
    return {marginLeft, width};
}

export const getLoadingLeft = () => {
    let documentWidth = document.documentElement.clientWidth;
    return (documentWidth/2 - 100);
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