function getUrlParameterByName(name, url) {
  if (!url) { url = window.location.href }
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) { return null }
  if (!results[2]) { return '' }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function callApi(url, method, data, success, failure) {
  data = data ? JSON.stringify(data) : null;
  $.ajax({
    contentType: 'application/json',
    url,
    dataType: 'json',
    data,
    method,
    async: true,
    success: function (response) {
      const { message, errorCode } = response;

      if (errorCode === 'FAILURE') {
        failure(message);

        return;
      }

      success(response);
    },
    error: function (err) {
      failure();
    },
  });
}

function validateAccount(account) {
  if (account.indexOf('@') > -1) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(account);
  } else {
    const re = /^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
    return re.test(account);
  }
}

class Pagination {
  constructor(el, options) {
    const PLUGIN_NAME = 'pagination', PAGE_INDEX_CHANGED = 'pagination.valueChanged';
    const _self = this;
    _self.options = options || {};
    _self.el = el;
    _self.dataPlugin = _self.el.getAttribute('data-plugin');

    if(PLUGIN_NAME !== _self.dataPlugin) {
      throw Error('Data data-plugin not found : ' + PLUGIN_NAME);
    }

    _self.numberLimited = 5;
    _self.pageCount = 0;

    _self.el.innerHTML = renderTemplate();

    _self.pageItemPrev = _self.el.querySelector('.js-page-item-prev');
    _self.pageItemNext = _self.el.querySelector('.js-page-item-next');
    _self.pageItemNumber = _self.el.querySelectorAll('.js-page-item-number');
    _self.dataPagination = JSON.parse(_self.el.getAttribute('data-pagination'));

    _self.dispatchOnClickEvent = function (pageIndex) {
      let event;
      if(document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(PAGE_INDEX_CHANGED, true, true);
        event.eventName = PAGE_INDEX_CHANGED;
        event.pageIndex = pageIndex;
        _self.el.dispatchEvent(event);
      }
    };

    _self.removeButtonActive = function() {
      for (let ele of _self.pageItemNumber ) {
        ele.classList.remove('active');
      }
    };

    for (let ele of _self.pageItemNumber ) {
      ele.onclick = function () {
        const eleCurrent = this.classList.contains('active');
        if (eleCurrent) return;

        _self.removeButtonActive();
        _self.dispatchOnClickEvent(parseInt(this.textContent));
      }
    }

    _self.pageItemPrev.onclick = function () {
      const pageIndex = parseInt(_self.el.querySelector('.js-page-item-number.active').textContent);
      if (pageIndex === 1) {
        return;
      }

      _self.dispatchOnClickEvent(pageIndex - 1);
    };

    _self.pageItemNext.onclick = function () {
      const pageIndex = parseInt(_self.el.querySelector('.js-page-item-number.active').textContent);
      if (pageIndex === _self.pageCount) {
        return;
      }

      _self.dispatchOnClickEvent(pageIndex + 1);
    };

    this.render(_self.dataPagination);

    function renderTemplate() {
      return `
        <ul class="pagination">
          <li class="page-item js-page-item-prev">
            <a class="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>

          <li class="page-item js-page-item-number">
            <a class="page-link">1</a>
          </li>
          <li class="page-item js-page-item-number">
            <a class="page-link">2</a>
          </li>
          <li class="page-item js-page-item-number">
            <a class="page-link">3</a>
          </li>
          <li class="page-item js-page-item-number">
            <a class="page-link">4</a>
          </li>
          <li class="page-item js-page-item-number">
            <a class="page-link">5</a>
          </li>

          <li class="page-item js-page-item-next">
            <a class="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      `;
    }
  }

  render(params) {
    const { pageIndex, pageCount } = params;
    this.pageCount = pageCount;

    if (pageIndex > pageCount) return;

    if (pageCount === 1) {
      this.el.classList.add('hidden');

      return;
    }

    this.el.classList.remove('hidden');
    if (pageIndex === 1) {
      this.pageItemPrev.classList.add('no-pointer');
    } else {
      this.pageItemPrev.classList.remove('no-pointer');
    }

    if (pageIndex === pageCount) {
      this.pageItemNext.classList.add('no-pointer');
    } else {
      this.pageItemNext.classList.remove('no-pointer');
    }

    for (let ele of this.pageItemNumber ) {
      ele.classList.add('hidden');
      ele.classList.remove('active');
    }

    if (params.pageCount <= this.numberLimited ) {
      for(let i=0; i < params.pageCount; i++) {
        if (pageIndex === i + 1) {
          this.pageItemNumber[i].classList.add('active');
        }

        this.pageItemNumber[i].classList.remove('hidden');
      }
    }
    else {
      if ((1 <= pageIndex <= 2) || (pageCount - 1 <= pageIndex <= pageCount)) {
        this.pageItemNumber[0].innerHTML = `<a class="page-link ${pageIndex === 1 ? 'active' : ''}">1</a>`;
        this.pageItemNumber[1].innerHTML = `<a class="page-link ${pageIndex === 2 ? 'active' : ''}">2</a>`;
        this.pageItemNumber[2].innerHTML = '<a class="page-link no-pointer">...</a>';
        this.pageItemNumber[3].innerHTML = `<a class="page-link ${pageIndex === pageCount - 1 ? 'active' : ''}">${pageCount - 1}</a>`;
        this.pageItemNumber[4].innerHTML = `<a class="page-link ${pageIndex === pageCount ? 'active' : ''}">${pageCount}</a>`;
      }
      else {
        this.pageItemNumber[0].innerHTML = '<a class="page-link">1</a>';
        this.pageItemNumber[1].innerHTML = '<a class="page-link no-pointer">...</a>';
        this.pageItemNumber[2].innerHTML = `<a class="page-link active">${pageIndex}</a>`;
        this.pageItemNumber[3].innerHTML = '<a class="page-link no-pointer">...</a>';
        this.pageItemNumber[4].innerHTML = `<a class="page-link">${pageCount}</a>`;
      }
    }
  }

  getIndexButtonActive() {
    const itemNumberActive = this.el.querySelector('.js-page-item-number.active');
    return itemNumberActive ? itemNumberActive.textContent : 1;
  }
}
