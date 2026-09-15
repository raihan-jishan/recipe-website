

export const getBookmarks = () => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("bookmarked_recipes");
  return saved ? JSON.parse(saved) : []; 
};

export const toggleBookmark = (recipe) => {
  const bookmarks = getBookmarks();
  const recipeId = recipe._id || recipe.id;
  const isBookmarked = bookmarks.some(
    (item) => (item._id || item.id) === recipeId,
  );

  let updatedBookmarks;
  if (isBookmarked) {
    updatedBookmarks = bookmarks.filter(
      (item) => (item._id || item.id) !== recipeId,
    );
  } else {
    updatedBookmarks = [...bookmarks, recipe];
  }

  localStorage.setItem("bookmarked_recipes", JSON.stringify(updatedBookmarks));
  return !isBookmarked;
};

export const isRecipeBookmarked = (recipeId) => {
  const bookmarks = getBookmarks();
  return bookmarks.some((item) => (item._id || item.id) === recipeId);
};
