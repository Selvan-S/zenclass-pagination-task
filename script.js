window.onload = function () {
  localStorage.removeItem("page");
};
const h1 = document.createElement("h1");
h1.setAttribute("id", "title");
h1.innerHTML = "WEB DEVELOPER TASK";
document.body.appendChild(h1);

const p = document.createElement("p");
p.setAttribute("id", "description");
p.innerHTML = "Pagination in DOM Manipulation";
document.body.appendChild(p);

const tableDiv = document.createElement("div");
tableDiv.setAttribute("class", "table-responsive");
tableDiv.setAttribute("id", "tableDiv");
document.body.appendChild(tableDiv);

let tbl = document.createElement("table");
tbl.setAttribute("id", "table");
tbl.classList.add("table", "table-bordered");
let header = tbl.createTHead();
let row = header.insertRow(0);
row.insertCell(0).innerHTML = "ID";
row.insertCell(1).innerHTML = "Name";
row.insertCell(2).innerHTML = "Email";
let Tbody = tbl.createTBody();
tableDiv.appendChild(tbl);
let tbodycount = tbl.lastChild.childElementCount;

const xhr = new XMLHttpRequest();
xhr.open("GET", "./pagination.json");
xhr.send();
xhr.onload = () => {
  const response = xhr.response;
  const paginationData = JSON.parse(response);
  let page = {
    first: 0,
    last: 0,
  };
  const getLocalItem = JSON.parse(localStorage.getItem("page"));
  if (getLocalItem != null) {
    page.first = getLocalItem.first;
    page.last = getLocalItem.last;
  } else {
    page.first = 0;
    page.last = 9;
  }
  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "buttons");
  buttonsDiv.setAttribute("class", "d-flex justify-content-center");
  document.body.appendChild(buttonsDiv);

  let pagenationBar = document.createElement("div");

  pagenationBar.setAttribute("class", "pageBarStyle");

  buttonsDiv.appendChild(pagenationBar);

  localStorage.setItem("page", JSON.stringify(page));
  let totalItemCount = paginationData.length;
  let totalPagesNum = Math.ceil(totalItemCount / 9);
  let currentPageNum = 1;
  if (currentPageNum == 1) {
    Table(1, paginationData);
  } else {
    Table(currentPageNum, paginationData);
  }
  let maxPage = Math.min(totalPagesNum, Math.max(currentPageNum + 4, 10));
  let minPage = Math.max(1, Math.min(currentPageNum - 5, maxPage - 9));

  const updatePageBar = (currentPage, maxPage, minPage) => {
    if (currentPage > 1) {
      pagenationBar.removeChild(pagenationBar.children[0]);
    }
    pagenationBar.innerHTML = `<ul class="pagination">
    <li class="page-item"><a class="page-link" href="#">First</a></li>
    <li class="page-item"><a class="page-link" href="#">Last</a></li>
    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>`;
    for (let index = minPage; index <= maxPage; index++) {
      pagenationBar.firstElementChild.innerHTML += `<li class="page-item">
          <a class="page-link" href="#">
            ${index}
          </a>
        </li>`;
    }
    selectPageBarLi();
  };
  updatePageBar(currentPageNum, maxPage, minPage);
  selectPageBarLi();

  function selectPageBarLi() {
    const allLi = pagenationBar.querySelectorAll("li");
    allLi.forEach((element) => {
      element.addEventListener("click", () => {
        currentPageNum = parseInt(element.innerText);
        if (isNaN(currentPageNum)) {
          const currentPageText = element.innerText;
          updatePageBar(currentPageNum, maxPage, minPage);
          Table(currentPageText, paginationData);
        } else {
          maxPage = Math.min(totalPagesNum, Math.max(currentPageNum + 4, 10));
          minPage = Math.max(1, Math.min(currentPageNum - 5, maxPage - 9));
          updatePageBar(currentPageNum, maxPage, minPage);
          Table(currentPageNum, paginationData);
        }
      });
    });
  }

  function Table(currentPage, data) {
    if (currentPage == "Previous") {
      if ((page.first + 9) / 9 > 1) {
        currentPageNum = (page.first + 9) / 9 - 1;
        page.first = currentPageNum * 9 - 9;
        page.last = currentPageNum * 9;
        localStorage.setItem(page, JSON.stringify(page));
      }
    } else if (currentPage == "Next") {
      if (page.last / 9 < totalPagesNum) {
        currentPageNum = page.last / 9 + 1;
        page.first = currentPageNum * 9 - 9;
        page.last = currentPageNum * 9;
        localStorage.setItem(page, JSON.stringify(page));
      }
    } else if (currentPage == "First") {
      currentPageNum = 1;
      page.first = currentPageNum * 9 - 9;
      page.last = currentPageNum * 9;
      localStorage.setItem(page, JSON.stringify(page));
    } else if (currentPage == "Last") {
      currentPageNum = totalPagesNum;
      page.first = currentPageNum * 9 - 9;
      page.last = currentPageNum * 9;
      localStorage.setItem(page, JSON.stringify(page));
    } else if (currentPage >= 1) {
      page.first = currentPage * 9 - 9;
      page.last = currentPage * 9;
      localStorage.setItem(page, JSON.stringify(page));

      first = page.last;
      last = currentPage * 5;
    }
    if (tbodycount > 1) {
      for (let index = 0; index < tbodycount; index++) {
        tbl.lastElementChild.removeChild(tbl.childNodes["1"].children[0]);
      }
    }
    data.slice(page.first, page.last).map((val) => {
      const tr = Tbody.insertRow();
      tr.innerHTML = `<td>${val.id}</td><td>${val.name}</td><td>${val.email}</td>`;
    });
    tbodycount = tbl.lastChild.childElementCount;
  }
};
