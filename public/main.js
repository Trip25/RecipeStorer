const url = "http://localhost:3000";

const recipesSection = document.querySelector("#recipes");
const getRecipeButton = document.querySelector("#get-recipes");
const submitButton = document.querySelector("button[type='submit']");
const ingredientButton = document.querySelector("#add-ingredient");
const ingredientsInput = document.querySelector("#ingredients-input");
const ingredientsList = document.querySelector("#ingredients-list");
const editRecipeButton = document.querySelector("#edit-button");

ingredientButton.addEventListener("click", addIngredient);
submitButton.addEventListener("click", handleSubmit);
getRecipeButton.addEventListener("click", handleClick);


function addIngredient(event) {
  event.preventDefault();

  const li = document.createElement("li");
  const { value } = ingredientsInput;
  if (value === "") {
    return;
  }
  li.innerText = value;
  ingredientsInput.value = "";
  ingredientsList.appendChild(li);
}

function handleSubmit(event) {
  event.preventDefault();
  createRecipe();

  const ingredientsList = document.querySelector("#ingredients-list");
  ingredientsList.innerHTML = "";

  // empty input boxes when create recipe button clicked
  document.querySelector("#title").value = "";
  document.querySelector("#instructions").value = "";
  document.querySelector("#image-url").value = "";
}

async function deleteRecipe(recipeId){
    const response = await fetch(`${url}/api/recipes/${recipeId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    // Refresh the recipes list after deleting
    getRecipes();
  }

async function fillEditInput(recipeId , title, ingredients, instructions, image){
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector("#title").value = title;
  document.querySelector("#image-url").value = image;
  // TODO: INGREDIENTS NEEDS FIXING
  // document.querySelector("#ingredients-list").value = [...ingredients];
  // ingredients.forEach(ingredient => document.querySelector("#ingredients-list").value = ingredient);
  document.querySelector("#instructions").value = instructions;

}

async function editRecipe(recipeId) {
  console.log(gatherFormData());
  const response = await fetch(`${url}/api/recipes/${recipeId} `, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gatherFormData()),
  });
  const data = await response.json();
  console.log(data);
}

async function createRecipe() {
  console.log(gatherFormData());
  const response = await fetch(`${url}/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gatherFormData()),
  });
  const data = await response.json();
  console.log(data);
}


function gatherFormData() {
  const title = document.querySelector("#title").value;
  const ingredientsList = document.querySelectorAll("#ingredients-list > li");
  const ingredients = Array.from(ingredientsList).map((li) => li.innerText);
  const instructions = document.querySelector("#instructions").value;
  const image = document.querySelector("#image-url").value;
  return {
    title,
    ingredients,
    instructions,
    image,
  };
}

function handleClick(event) {
  event.preventDefault();
  getRecipes();
}

async function getRecipes() {
  const response = await fetch(`${url}/api/recipes`);
  const { payload } = await response.json();
  recipesSection.innerHTML = "";
  console.log(payload);
  payload.forEach(renderRecipe);
}

function renderRecipe(recipe) {
  const article = createRecipeView(recipe);
  const recipeContainer = document.createElement("div");
  recipeContainer.appendChild(article);
  recipesSection.appendChild(recipeContainer);
}

function createRecipeView({ title, ingredients, instructions, image, id }) {
  const article = document.createElement("article");
  const h2 = document.createElement("h2");
  h2.innerText = title;
  const p = document.createElement("p");
  p.innerText = instructions;
  const img = document.createElement("img");
  img.src = image;
  img.alt = title;
  const list = createIngredientsList(ingredients);
  article.appendChild(h2);
  article.appendChild(img);
  article.appendChild(list);
  article.appendChild(p);

  // Add delete recipe button and listener
  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-button";
  deleteButton.innerText = "Delete recipe";
  deleteButton.addEventListener("click", () => (deleteRecipe(id)));
  article.appendChild(deleteButton)

  //Add edit recipe button and listener
  const editButton = document.createElement("button");
  editButton.id = "edit-selected-recipeBtn";
  editButton.innerText = "Edit recipe";
  editButton.addEventListener("click", () => (fillEditInput(id, title, ingredients, instructions, image)));
  article.appendChild(editButton)


  return article;
}
editRecipeButton.addEventListener("click", ()=>{editRecipe(id)});

function createIngredientsList(ingredients) {
  const ul = document.createElement("ul");
  ingredients.map(createIngredient).forEach(function (item) {
    ul.appendChild(item);
  });
  return ul;
}

function createIngredient(ingredient) {
  const li = document.createElement("li");
  li.innerText = ingredient;
  return li;
}

getRecipes();