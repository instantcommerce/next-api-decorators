<p align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-api-decorators</h1>
</p>

## Available decorators

### Class decorators
|             | Description |
| ----        | ----------- |
| `SetHeader` | Sets a header value into the response for all routes defined in the class.

### Method decorators
|             | Description |
| ---         | ----------- |
| `Get`       | Marks the method as `GET` method handler.
| `Post`      | Marks the method as `POST` method handler.
| `Put`       | Marks the method as `PUT` method handler.
| `Delete`    | Marks the method as `DELETE` method handler.
| `SetHeader` | Sets a header key/value into the response for the route.
| `HttpCode`  | Sets the http code the route response.
