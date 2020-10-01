﻿using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Domain.Identity;

namespace ProAgil.API.Helpers

{
    public class AutoMapperProfiles : Profile {
        public AutoMapperProfiles () {

            CreateMap<Evento, EventoDTO> ()
                .ForMember (dest => dest.Palestrantes, opt => {
                    opt.MapFrom (src => src.PalestranteEventos.Select (x => x.Palestrante).ToList ());
                }).ReverseMap ();

            CreateMap<Palestrante, PalestranteDTO> ()
                .ForMember (dest => dest.Eventos, opt => {
                    opt.MapFrom (src => src.PalestranteEventos.Select (x => x.Evento).ToList ());
                }).ReverseMap ();

            CreateMap<Lote, LoteDTO> ().ReverseMap ();

            CreateMap<RedeSocial, RedeSocialDTO> ().ReverseMap ();

            CreateMap<User, UserDTO> ().ReverseMap ();

            CreateMap<User, UserLoginDTO> ().ReverseMap ();
        }
    }
}