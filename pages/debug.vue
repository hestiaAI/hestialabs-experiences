<template>
  <div>
    <h1>How did you get here?</h1>
    <p>This is just to test netlify forms file</p>
    <template>
      <section>
        <div>
          <form name="file-upload" method="post" data-netlify="true">
            <div>
              <input type="hidden" name="form-name" value="contact-form" />
              <div>
                <input
                  for="name"
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  required
                  placeholder="Message"
                ></textarea>
              </div>
              <div>
                <input type="file" name="picture" />
              </div>
              <div>
                <button type="submit" value="Send file">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </template>
  </div>
</template>
