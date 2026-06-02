# My First Game Engine

https://github.com/itzi97/engine2d-old

Many people think of game engines such as Unity or Unreal as being very complete, feature rich with their own editor included, but when I started my first game engine, I barely finished freshman year at DigiPen and didn't have much experience in programming game engine architecture other than for the games I've worked during that college year.

So starting from scratch, I bundled up all the knowledge I had from those years, and thought of the following ideas for my game engine:

- Having an ECS
- Made in C++
- Lua scripting aside
- Using SDL2 for graphics
- Components having logic within them
- Using design patterns for the game engine

Using C++ is a choice I made mostly because I wanted to make it easy on myself. I understand that unpropper use of C++ can result in your engine having many memory leaks or not very optimized, but at the time it was the only thing I programmed in, so it just felt the most natural fit.

ECS just felt like second hand nature to me, since it's what I was used to using and I really like using ECS architecture because of how easy it is to graph out. The only issue with the ECS system that I found was having a function to add components that could add any component no matter what kind of component it was to each entity, and i struggled a bit but ended up utilizing the template feature from C++ alongside the variadic parameter functionality to be able to do this. It looks hella ugly not gonna lie but at least it works you know? Probably not very safe though to be honest. i also used many other design patterns that I learnt from either design patterns class or algorithms class at U-tad and added these to my engine such as the singleton.

Using SDL2 was also a simple choice, honestly, it made everything so much easier, since having SDL2 made it to the point where I didn't have to worry about graphics programming at all, or asset management, or font managing, etc, there were so amny things that SDL2 made easier, and I think that is the whole point of this engine. It is merely a project where I work on having the architecture done from scratch as a learning experience without learning some other details like graphics bog me out.

The one new thing that i added that I didn't do before in a game engine was lua scripting. I learnt this from a course I took in Udemy and oh my god it is so nice to have game logic and game engine code separated this way, why haven't I done this before? I could have given this engine to someone with not much technical programming knowledge and have them program the game without having to touch C++ could with my engine? that is so cool, and honestly, it made adding game logic a super nice thing.

All in all, I ended up dropping the engine at a certain point and dind't really make any functioning games with it, but it was a super nice learning experience that I value a lot since it got me to really learn how to implement ECS architecture properly and separate game engine code with game logic code better, which is somethig that I haven't done before.
