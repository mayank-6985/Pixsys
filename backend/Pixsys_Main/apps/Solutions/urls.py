from django.urls import path
from .views import *
urlpatterns = [
    path('' , SolutionListView.as_view() , name="Solution list"),
    path('<int:solutions_id>' , SolutonDetailView.as_view() , name="Solution details"),
    path('update/solution' , SolutionUpdateView.as_view() , name = "Update Solution details"),
    path('update/category' , SolutionCategoryUpdateView.as_view() ,name = "Update Solutio Category details")
]

