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

export const getModalMeasures = () => {
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

export const getYear = (date) => {
  let values = date.split('-');
  return values[0];
}

export const getDate = (date) => {
  let values = date.split('-');
  date = new Date(values[0], values[1] - 1, values[2]);
  let newDate = date.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$1 $2, $3');
  let currentDate = new Date().toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$1 $2, $3');
  let color;
  if(new Date(newDate).getTime() == new Date(currentDate).getTime())
  {
    color = 'yellow';
  }
  else
  {
    color = new Date(newDate).getTime() > new Date(currentDate).getTime() ? 'red': 'green';
  }
  return {color, date: newDate};
}