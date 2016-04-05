![Facechimp logo](https://s3-eu-west-1.amazonaws.com/facechimp/facechimp-vertical.png)

Facechimp is a Kibana plugin that allows user to get a complete search experience.
In Facehimp you can build Faces that basically lets you configure a search on top of any data hosted in an Elasticsearch cluster.

Facechimp supports:
- Full text search 
- Suggestion
- Highlighing 
- Did you mean
- Faceted search
- Geo based search

## Requirements 

Facechimp can be installed on Kibana 4.3.x or above.

## Installation

From the Kibana installation directory:

```batch
bin/kibana plugin --install facechimp --url https://s3-eu-west-1.amazonaws.com/facechimp/facechimp-0.1.2.tar.gz
```



## Instructions

### Create a cluster

Facechimp can connect to any Elasticsearch cluster, you first need to define a connection
to a cluster in a the settings section.

### Create a Face

A face is a search view on top of any data indexed in Elasticsearch. 
In terms of user experience, the user will get a list of results depending on the key words he typied.
Each result is composed of:

- A title 
- A content 
- A link

Eventually, a Face can render images based on links contained in the document
but also render points on a map, if the document contains geo points.

To create a Face, click on the "+" button in the right above the table in the Faces section.

#### Face config

- Set a name, in order to retreive the Face by name in the Faces section
- Set a cluster to which a Face will connect to search for data
- Set the page size, in order words, the number of maximum results to show on a page. As the user scroll down, new results will be fetched.

#### Indices

You can select one or more indices on which the search will be done 

#### Fields

You can select one or more fields that will be used to search. The field will be boosted
in order of choice.

#### Search results

- Set an output title: the title used in the result block 
- Set an output content: shows an extract of the content with the search key words highlighted
- Set an output URL: will be the one used when a user clicks on a result

Optionally:

- Set an output image URL: will be used to render an image
- Set a location field: will be used to render geo point on a map

#### Search Facets

Facets are used to filter the displayed results, this is basically using the aggreagtion framework underneath.
You can add one or more facets.





