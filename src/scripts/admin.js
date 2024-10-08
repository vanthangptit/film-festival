document.addEventListener('DOMContentLoaded', function () {
  const adminPage = document.querySelector('.js-admin-page');
  if (!adminPage) return;

  const __GLOBAL = {
    create: 'Submission',
    edit: 'Save',
    delete: 'Delete',
    apiData: {
      url: '/api/post',
      create: {
        method: 'POST'
      },
      edit: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    }
  };

  const postsTable = document.querySelector('.js-posts-table');
  const tableResponsive = postsTable.querySelector('.js-table-responsive');
  const tbodyTable = postsTable.querySelector('table tbody');
  const noResults = postsTable.querySelector('.js-no-results');

  const paginationContain = document.querySelector('.js-pagination-contain');

  const buttonToggleModal = document.querySelectorAll('.js-btn-toggle-modal');
  const modalFormContainer = document.querySelector('.js-modal-admin-form');
  const modalForm = modalFormContainer.querySelector('.js-modal-form');
  const modalTitle = modalFormContainer.querySelector('.js-modal-title');
  const buttonSubmit = modalFormContainer.querySelector('[type="submit"]');
  const messageModal = modalFormContainer.querySelector('.message-modal');

  const pageSize = parseInt(paginationContain.getAttribute('data-page-size'));
  const  modalAdminForm = new bootstrap.Modal(modalFormContainer, {});
  const pagination = new Pagination(paginationContain, {});

  const ACTIONS = {
    create: function() {
      modalTitle.innerHTML = this.getAttribute('data-title');
      modalForm.innerHTML = createPostTemplate();
      buttonSubmit.innerHTML = `${__GLOBAL.create}<span class="fa fa-refresh hidden"></span>`;
      buttonSubmit.setAttribute('data-action', 'create');

      modalAdminForm && modalAdminForm.show();
    },
    edit: function () {
      const args = {
        el: this,
        action: 'edit'
      };

      handleUpdatePost(args);
    },
    delete: function () {
      const args = {
        el: this,
        action: 'delete'
      };

      handleUpdatePost(args);
    }
  };

  function removeHashOnURL() {
    window.history.pushState(window.history.state, document.title, `${window.location.pathname}`);
  }

  function checkHashTagUrl() {
    return getUrlParameterByName('shownModalCreatePost', window.location.search);
  }

  function showModalByHashTagUrl() {
    const buttonCreatePost = adminPage.querySelector('[data-action="create"]');
    if (checkHashTagUrl()) {
      window.scroll({
        top: buttonCreatePost.offsetTop - 50,
        behavior: 'smooth'
      });

      setTimeout(function () {
        buttonCreatePost.click();
      }, 700);
    }
  }

  function attachEventClickToggle(elements) {
    for (let buttonModal of elements ) {
      buttonModal.onclick = function () {
        const actionName = this.getAttribute('data-action');

        ACTIONS[actionName] && ACTIONS[actionName].call(this);
      }
    }
  }

  function handleApiSuccess(response) {
    const { pageIndex, pageSize, pageCount, posts } = response.data;
    handleShowContent({
      message: response.message,
      hasPostExists: !!(posts && posts.length),
      pageCount
    });

    if (!posts || !posts.length) return;

    paginationContain.setAttribute('data-page-size', pageSize);
    tbodyTable.innerHTML = renderTable(posts);
    pagination.render({ pageIndex, pageCount });

    const toggleModal = document.querySelectorAll('.js-btn-toggle-modal');
    attachEventClickToggle(toggleModal);
  }

  function handleApiError(err) {
    message(err.message, true);
  }

  function message(mess, isError) {
    const faRefresh = document.querySelector('.fa.fa-refresh');

    if (faRefresh && faRefresh.length > 0) {
      faRefresh.classList.add('hidden');
    }

    if (isError) {
      messageModal.classList.add('text-danger');
    } else {
      messageModal.classList.add('text-success');
    }

    modalFormContainer.classList.add('api-called');
    messageModal.innerHTML = mess;
  }

  function handleShowContent(params) {
    message(params.message);
    if (params.hasPostExists) {
      tableResponsive.classList.remove('hidden');
      noResults.classList.add('hidden');
    } else {
      tableResponsive.classList.add('hidden');
      noResults.classList.remove('hidden');
    }
  }

  function handleUpdatePost(params) {
    const el = params.el;
    const action = params.action;

    const title = el.getAttribute('data-title');
    const label = el.getAttribute('data-label');
    const content = el.getAttribute('data-content');
    const author = el.getAttribute('data-author');
    const id = el.getAttribute('data-id');

    const param = {
      updateContent: action === 'edit',
      label,
      content,
      author
    };

    modalTitle.innerHTML = title;
    modalForm.innerHTML = createPostTemplate(param);
    buttonSubmit.innerHTML = `${action === 'edit' ? __GLOBAL.edit : __GLOBAL.delete}<span class="fa fa-refresh hidden"></span>`;
    buttonSubmit.setAttribute('data-action', `${action === 'edit' ? 'edit' : 'delete'}`);
    buttonSubmit.setAttribute('data-id', id);

    modalAdminForm && modalAdminForm.show();
  }

  function createPostTemplate(params) {
    const titleHtml = params && params.label ? (params.updateContent ? `<input type="text" name="title" class="js-title-post" value="${params.label}" required/>` :
      `<span>${params.label}</span>`) : `<input type="text" class="js-title-post" name="title" required value=""/>`;

    const contentHtml = params && params.content ? (params.updateContent ? `<textarea name="content" class="js-content-post" cols="30" rows="10"/>${params.content}</textarea>` :
      `<span>${params.content}</span>`) : `<textarea name="content" class="js-content-post" cols="30" rows="10"></textarea>`;

    const author = params && params.author ? (params.updateContent ? `<input type="text" name="author" required class="js-author-post" value="${params.author}"/>` :
      `<span>${params.author}</span>`) : `<input type="text" class="js-author-post" name="author" required value=""/>`;

    return `
      <div class="row">
        <div class="col-12 col-sm-2">
          <span class="modal-label">Title:</span>
        </div>
        <div class="col-12 col-sm-10">
          ${titleHtml}
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-2">
          <span class="modal-label">Contents:</span>
        </div>
        <div class="col-12 col-sm-10">
          ${contentHtml}
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-2">
          <span class="modal-label">Author:</span>
        </div>
        <div class="col-12 col-sm-10">
          ${author}
        </div>
      </div>
    `;
  }

  function renderTable(posts) {
    let listTemplate = '', i = 0;

    while (i < posts.length) {
      const item = posts[i];
      listTemplate += `
        <tr>
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.content}</td>
          <td>${item.author}</td>
          <td>${item.created_at}</td>
          <td>${item.updated_at}</td>
          <td>
            <button class="btn btn-info js-btn-toggle-modal" data-target=".js-modal-admin-form" title="Edit"
                    data-action="edit"
                    data-title="Update post"
                    data-author="${item.author}"
                    data-label="${item.title}"
                    data-content="${item.content}"
                    data-id="${item.id}">
              Edit
            </button>
            <button class="btn btn-danger js-btn-toggle-modal" data-target=".js-modal-admin-form" title="Delete"
                    data-action="delete"
                    data-title="Delete post"
                    data-author="${item.author}"
                    data-label="${item.title}"
                    data-content="${item.content}"
                    data-id="${item.id}">
              Delete
            </button>
          </td>
        </tr>
      `;
      i++;
    }

    return listTemplate;
  }

  buttonSubmit.onclick = function (e) {
    e.preventDefault();

    this.querySelector('.fa.fa-refresh').classList.remove('hidden');
    const action = this.getAttribute('data-action').toLowerCase();
    const id = parseInt(this.getAttribute('data-id'));
    const method = __GLOBAL.apiData[action].method;
    const title = document.querySelector('.js-title-post');
    const content = document.querySelector('.js-content-post');
    const author = document.querySelector('.js-author-post');

    let requestData = {
      title: title && title.value ? title.value : '',
      content: content && content.value ? content.value : '',
      author: author && author.value ? author.value : '',
    };

    if (!!id) {
      if (action === 'delete') {
        requestData = {}
      }

      requestData.id = id;
    }

    requestData.pageSize = pageSize;
    requestData.pageIndex = pagination.getIndexButtonActive();

    setTimeout(() => {
      callApi(__GLOBAL.apiData.url, method, requestData, handleApiSuccess, handleApiError);
    }, 1000);
  };

  showModalByHashTagUrl();
  attachEventClickToggle(buttonToggleModal);

  modalFormContainer.addEventListener('hidden.bs.modal', function (event) {
    modalFormContainer.classList.remove('api-called');

    if (checkHashTagUrl()) {
      removeHashOnURL();
    }
  });

  paginationContain.addEventListener('pagination.valueChanged', function (event) {
    if (!event.pageIndex) return;

    const url = `${__GLOBAL.apiData.url}/${event.pageIndex}/${pageSize}/pagination`;
    setTimeout(() => {
      callApi(url, 'GET', null, handleApiSuccess, handleApiError);
    }, 1000);
  });

  window.onpopstate = function (e) {
    if (checkHashTagUrl()) {
      showModalByHashTagUrl();
    } else {
      modalAdminForm && modalAdminForm.hide();
    }
  };
});
