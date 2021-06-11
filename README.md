

# BeautPlayer

A beautifully designed streaming music player built on MERN stack for local networks.
It has two components:
1. Beautplayer: frontend; made using react.js; fully responsive
2. Mediaserver: backend; made using express.js to serve the REST API which frontend consumes; manages the mongodb database of all the tracks, albums, playlists and metadata

### Use Case

Some people (including me) like to maintain their own collection of favourite music on their devices, offline. Over time, these collections grow big in size and it becomes infeasible to store and sync the copies on each device (PC/phone/etc). This was my urge to make this application. User can simply put the collection onto one machine in their home (generally any old pc lying in the garage would work), and setup this player. Then, all the tracks can be easily streamed over the local network through an eye-candy UI, all the basic features someone might need in a music player - albums, playlists, fading/crossfading, gapless playback, equaliser (coming in future version) and obviously, great control over the looks and feel of the player.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js and Mongodb should be setup on the machine. 

### Branches

The project has two major branches -- 
1. ``main`` branch: stable code, might not be much updated
2. ``active-dev`` branch: latest changes, not much tested

Other branches are for features and hotfixes.

### Installing

1. Clone the repo main branch:
```
> git clone https://github.com/Mynk-9/beautplayer
```
2. Navigate to the directory:
```
> cd beautplayer
```
3. Now, the repository has two subdirectories -- ``beautplayer`` and ``mediaserver``. First we install the dependencies of beautplayer:
```
> cd beautplayer
> npm install
```
4. Now we install the dependencies of mediaserver:
```
> cd ../mediaserver
> npm install
```
5. *[This step would not be required in future]* Finally, go to ``mediaserver/app.js`` file and change the music directory path in line 8, 9 as per your machine.


## Deployment

This would run on a machine on the local network which has all the music stored. And other devices (pc or phones) can access.
1. Navigate CLI to the ``beautplayer/mediaserver`` directory and start it: `` npm start ``
2. Navigate CLI to the ``beautplayer/beautplayer`` directory and start it: `` npm start ``

## First Start

You might need to go to settings and click on "Refresh Media Library" option. 

## Contributing

Feel free to post issues and pull requests with detailed explainations.

## Versioning

For the versions available, see the [tags on this repository](https://github.com/Mynk-9/beautplayer/tags). 

## Authors

* **Mayank Mathur** - [Mynk-9](https://github.com/Mynk-9)

See also the list of [contributors](https://github.com/Mynk-9/beautplayer/tags) who participated in this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used :)
* Inspiration: Spotify, Groove Music, Apple Music for UI/UX and, the hassle to store my collections on all my devices and keep them updated all the time for idea.
* This awesome readme template by [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2).
