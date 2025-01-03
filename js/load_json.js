/**
 * \\Author: Thibault Napoléon "Imothep"
 * \\Company: ISEN Ouest
 * \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 * \\Created Date: 16-Oct-2024 - 12:33:39
 * \\Last Modified: 03-Jan-2025 - 16:02:52
 */

'use strict';

// Constants.
const IDENTITY1 = 'Thibault Napoléon';
const IDENTITY2 = 'Thibault Napoleon';
const HAL_API_URL = 'https://api.archives-ouvertes.fr/search/' +
  '?q=auth_t:"' + IDENTITY1 + '"&fl=halId_s,docid,docType_s,authFullName_s,' +
  'title_s,citationRef_s,label_s,label_bibtex,seeAlso_s,producedDateY_i&' +
  'sort=producedDate_s desc&rows=1000';
const MINIMUM_ITEMS = 5;

// Load the data.
loadData('json/profil.json');
loadData('json/bio.json');
loadData('json/research.json');
loadData('json/publications.json', loadHALData);
loadData('json/teaching.json');

// Collapse menu on click (mobile).
handleMenuCollapse();

// Set the color scheme.
setColorScheme();

//------------------------------------------------------------------------------
//--- loadData -----------------------------------------------------------------
//------------------------------------------------------------------------------
// Load data from a JSON file.
// @param file: the file to load.
// @param callback: the callback to call when the data is loaded.
function loadData(file, callback=processData) {
  fetch(file)
    .then(response => response.json())
    .then(data => callback(data));
}

//------------------------------------------------------------------------------
//--- loadHALData --------------------------------------------------------------
//------------------------------------------------------------------------------
// Load data from HAL.
function loadHALData(data) {
  fetch(HAL_API_URL)
    .then(response => response.json())
    .then(publications => processHALData(publications, data));
}

//------------------------------------------------------------------------------
//--- processHALData -----------------------------------------------------------
//------------------------------------------------------------------------------
// Process the publications loaded from HAL.
// Process the data loaded from the JSON file.
// @param data: the data to process.
function processHALData(publications, data) {
  let types = {
    'ART': [0, 'journals'],
    'COMM': [1, 'conferences'], 'POSTER': [1, 'conferences'],
    'PATENT': [2, 'patents'],
    'THESE': [3, 'dissertations'],
  }

  // Process the publications.
  for (let publication of publications.response.docs)
  {
    let current_data = data[types[publication.docType_s][0]].data[
      types[publication.docType_s][1]].data;
    let authors = publication.authFullName_s.join(', ');
    authors = authors.replace(IDENTITY1, '<b><u>' + IDENTITY1 + '</u></b>');
    authors = authors.replace(IDENTITY2, '<b><u>' + IDENTITY2 + '</u></b>');
    current_data.id.push(publication.docid);
    current_data.authors.push(authors);
    current_data.title.push(publication.title_s);
    current_data.reference.push(publication.citationRef_s);
    current_data.hal.push(publication.halId_s);
    current_data.bibtex.push(publication.label_bibtex);
    current_data.code.push(publication.seeAlso_s);
    if (publication.seeAlso_s == undefined)
      current_data.codevisible.push('d-none');
    else
      current_data.codevisible.push('d-inline');
  }
  processData(data);
}

//------------------------------------------------------------------------------
//--- processData --------------------------------------------------------------
//------------------------------------------------------------------------------
// Process the data loaded from the JSON file.
// @param data: the data to process.
function processData(data) {
  // Process the global template.
  for (let part of data) {
    let html = part.template;

    // Process each key in the template.
    for (let key in part.data) {
      if (typeof part.data[key] === 'object') {
        let localData = part.data[key];
        let firstKey = Object.keys(localData.data)[0];
        let localHtml = '';
        for (let i = 0; i < localData.data[firstKey].length; i++) {
          localHtml += localData.template;
          for (let k in localData.data)
            localHtml = replaceHtml(localHtml, k, localData.data[k][i]);
        }
        html = replaceHtml(html, key, localHtml);
      }
      else
        html = replaceHtml(html, key, part.data[key]);
    }
    document.getElementById(part.section).innerHTML = html;
    if (part.data.number != undefined)
      updateVisibility(part.section + '-list', 0);
  }

}

//------------------------------------------------------------------------------
//--- replaceHtml --------------------------------------------------------------
//------------------------------------------------------------------------------
// Replace a key by a value in an HTML string.
// @param html: the HTML string.
// @param key: the key to replace.
// @param value: the value to insert.
function replaceHtml(html, key, value) {
  return html.replace('{' + key + '}', value);
}

//------------------------------------------------------------------------------
//--- updateVisibility ---------------------------------------------------------
//------------------------------------------------------------------------------
// Update the visibility of the items in a list.
// @param id: the id of the list.
// @param value: the value to add to the number of items to display.
function updateVisibility(id, value) {
  let element = document.getElementById(id);
  let items = element.getElementsByTagName('li');
  let number = parseInt(element.getAttribute('number')) + value;

  // Update the number of items to display.
  if (number < MINIMUM_ITEMS)
    number = MINIMUM_ITEMS;
  if (number > items.length)
    number = items.length;
  element.setAttribute('number', number);

  // Update the visibility of the items.
  for (let i = 0; i < items.length; i++) {
    if (i < number)
      items[i].classList.remove('d-none');
    else
      items[i].classList.add('d-none');
  }
}

//------------------------------------------------------------------------------
//--- handleMenuCollapse -------------------------------------------------------
//------------------------------------------------------------------------------
// Collapse the menu on click.
function handleMenuCollapse()
{
  for (let item of document.getElementById('menu').getElementsByTagName('a')) {
    item.addEventListener('click', function () {
      document.getElementById('menu').classList.remove('show');
    });
  }
}

//------------------------------------------------------------------------------
//--- setColorScheme -----------------------------------------------------------
//------------------------------------------------------------------------------
// Set the color scheme.
// @param mode: the color scheme ('light' or 'dark'). If it is undefined, the
// media preference is used.
function setColorScheme(mode)
{
  // Check media preference.
  if (mode == undefined)
  {
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
      mode = 'dark';
    else
      mode = 'light';
  }

  // Set the color scheme.
  document.getElementsByTagName('body')[0].style.colorScheme = mode;

  // Set color scheme icon.
  if (mode == 'light')
  {
    document.getElementById('color-scheme').innerHTML =
      '| <i class="bi bi-moon-fill color-scheme"></i>';
    document.getElementById('navbar').classList.remove('navbar-dark');
    document.getElementById('navbar').classList.add('navbar-light');
  }
  else
  {
    document.getElementById('color-scheme').innerHTML =
      '| <i class="bi bi-sun-fill color-scheme"></i>';
    document.getElementById('navbar').classList.remove('navbar-light');
    document.getElementById('navbar').classList.add('navbar-dark');
  }
}

//------------------------------------------------------------------------------
//--- switchColorScheme --------------------------------------------------------
//------------------------------------------------------------------------------
// Switch the color scheme.
function switchColorScheme()
{
  setColorScheme(document.getElementsByTagName('body'
    )[0].style.colorScheme == 'dark' ? 'light' : 'dark');
}
