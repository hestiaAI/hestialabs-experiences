# Kepler iframe

This is a workaround to run Kepler inside an iframe.

Kepler is made with react, so it's ultimately just javascript, and could be made to work inside vue. Last time I tried, there was a dependency conflict. I couldn't solve it, and it seemed like something that would happen again when we change versions.  
 
# Run the example 

For somewhat interactive development, you can run the example from the example folder from the root of the project:

    python -m http.server
   
Then visit http://localhost:8000/example
