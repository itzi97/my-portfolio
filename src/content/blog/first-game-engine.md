---
title: "Building My First Game Engine"
description: "What I learned building a C++ 2D game engine with ECS, SDL2, and Lua scripting: the decisions that worked, the ones that didn't, and why I'd do it again."
pubDate: 2026-06-02
tags: ["C++", "Game Dev", "Systems"]
---

When most people think of game engines they think of Unity or Unreal: full editors, asset pipelines, visual scripting, the works. What I built is nothing like that. I'd just finished my first year at DigiPen and had enough C++ and game architecture knowledge to be dangerous, so I sat down and built [engine2d-old](https://github.com/itzi97/engine2d-old) from scratch.

I wasn't trying to ship a game. The goal was to understand what a game engine actually *is* underneath the abstraction, and to separate the parts I already knew (game logic) from the parts I wanted to learn (architecture, scripting, the boundary between engine and game). ECS felt like the right architecture coming out of DigiPen — entities, components, systems, no inheritance hell. SDL2 handled windowing and rendering so that graphics programming wouldn't swallow the whole project. And Lua scripting was the thing I was most curious about: could I build a clean enough boundary that game logic never needed to touch engine source?

## ECS and the template problem

The tricky part of ECS was writing an `addComponent` method that could accept *any* component type without a massive if/else chain. I ended up using C++ templates with variadic parameters:

```cpp
template <typename T, typename... Args>
T& addComponent(Args&&... args) {
    auto component = std::make_unique<T>(std::forward<Args>(args)...);
    T& ref = *component;
    components[typeid(T)].emplace_back(std::move(component));
    return ref;
}
```

It's not the prettiest solution and I wouldn't call it bulletproof. There's no compile-time enforcement that `T` is actually a valid component type, but it works, and writing it taught me more about templates, perfect forwarding, and `typeid` than any course chapter did.

I also leaned on design patterns from class: singletons for the engine core, observers for events, a basic state machine for scene management. Looking back, the singleton usage was probably excessive, but at the time it made the architecture feel clean.

## SDL2 was the right call

Choosing SDL2 was deliberate. It handles windowing, input, texture loading, font rendering, and audio — basically everything that would have turned this into a graphics programming project instead of an architecture one. That was the point: I wanted to build the *structure* of an engine, not reinvent OpenGL.

The tradeoff is that SDL2 abstracts away things you'd eventually want control over, like custom render pipelines, draw call batching, and GPU resource management. That's a problem for a later engine. For a first one, removing that complexity was the right call.

## Lua scripting changed how I think about architecture

The biggest new addition, and the one I'm most glad I made, was Lua scripting via [Sol2](https://github.com/ThePhD/sol2). Game logic lives in `.lua` files, the engine exposes an API, and the two never touch each other's source code:

```lua
function onUpdate(dt)
    if Input.isKeyDown("RIGHT") then
        transform.x = transform.x + 200 * dt
    end
end
```

The separation is genuinely useful. Someone without C++ knowledge could write game behavior against the engine's Lua API without touching the engine source. It also forces you to think carefully about what the engine *exposes* versus what it keeps internal, a design discipline I've carried into every project since.

## What I'd do differently

The engine never produced a finished game, and I eventually archived it in favor of a [cleaner rewrite](https://github.com/itzi97/engine2d). The singletons would be the first thing to go — dependency injection makes systems easier to test and reason about in isolation, and the convenience of a global isn't worth the coupling. The template component approach also works but a proper component registry with compile-time checks would be safer. The bigger lesson though was about scope: I kept adding systems (audio, scene manager, font rendering) before the core was solid. Finish the foundation before building upward.

The engine still sits on GitHub, archived. It's not impressive by any professional standard, but it's an honest record of where I was at the time and probably the clearest way I know to measure how much ground I've covered since. The [rewrite](https://github.com/itzi97/engine2d) is the active version.
