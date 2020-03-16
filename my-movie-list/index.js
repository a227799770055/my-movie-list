(function () {
  // write your code here
  const base_url = 'https://movie-list.alphacamp.io/'
  const index_url = base_url + 'api/v1/movies'
  const poster_url = base_url + 'posters/'
  const data = []
  const data_panel = document.querySelector('#data-panel')
  const pagination = document.getElementById('pagination')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  //axios to api_database
  axios.get(index_url)
    .then((response) => {
      data.push(...response.data.results)
      // displayDataList(data)
      getTotalPage(data)
      getPageData(1, data)
    })
    .catch((err) => { console.log(err) })


  // EventListener
  data_panel.addEventListener('click', function (event) {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    console.log(results)
    // displayDataList(results)
    getTotalPage(results)
    getPageData(1, results)
  })

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })


  //Function
  //display data list
  function displayDataList(data) {
    let html_content = ''
    data.forEach(function (item, index) {
      html_content += `
        <div class="col-sm-3">
         <div class="card mb-2">
          <img class="card-img-top " src="${poster_url}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite col-3 offset-5" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    data_panel.innerHTML = html_content
  }

  //Modal function
  function showMovie(id) {
    //get element
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    //set request url
    const url = index_url + "/" + id

    //send request to api
    axios.get(url)
      .then((response) => {
        const data = response.data.results
        //insert data into modal ui
        modalTitle.innerHTML = data.title
        modalImage.innerHTML = `<img src="${poster_url}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.innerHTML = `relase at : ${data.release_date}`
        modalDescription.innerHTML = `${data.description}`
      })
      .catch((err) => console.log(err))
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number[id])) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))

    console.log(JSON.stringify(list))
    console.log(list)
  }

  //分頁
  function getTotalPage(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //取得分頁內容
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

})()







// listen to search form submit event
