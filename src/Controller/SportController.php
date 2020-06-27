<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Sport;

/**
 * @Route("/sports", name="sports_")
 */

class SportController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     */
    public function index()
    {
        $sports = $this->getDoctrine()->getRepository(Sport::class)->findAll();
        return $this->json([ 'data' => $sports ]);
    }


    /**
     * @Route("/{sportId}", name="show", methods={"GET"})
     */
    public function show($sportId)
    {
        $sport = $this->getDoctrine()->getRepository(Sport::class)->find($sportId);
        return $this->json([ 'data' => $sport ]);
    }



    /**
     * @Route("/", name="create", methods={"POST"})
     */
    public function create(Request $request)
    {
        $data = $request->request->all();

        $sport = new Sport();
        $sport->setName($data['name']);
        $sport->setDescription($data['description']);
        $sport->setRules($data['rules']);
        $sport->setSlug($data['slug']);
        $sport->setCreatedAt(new \DateTime('now', new \DateTimezone('America/Sao_Paulo')));
        $sport->setUpdatedAt(new \DateTime('now', new \DateTimezone('America/Sao_Paulo')));

        $doctrine = $this->getdoctrine()->getManager();
        $doctrine->persist($sport);
        $doctrine->flush();

        return $this->json(['data' => 'Mais um esporte cadastrado com sucesso']);
    }



    /**
     * @Route("/{id}", name="update", methods={"PUT", "PATCH"})
     */
    public function update($id, Request $request)
    {
        $data = $request->request->all();
        $doctrine = $this->getDoctrine();

        $sport =  $doctrine->getRepository(Sport::class)->find($id);

        if($request->request->has('name'))
            $sport->setName($data['name']);

        if($request->request->has('description'))    
            $sport->setDescription($data['description']);

        if($request->request->has('rules'))
            $sport->setRules($data['rules']);

        if($request->request->has('slug'))    
            $sport->setSlug($data['slug']);

        $sport->setUpdatedAt(new \DateTime('now', new \DateTimezone('America/Sao_Paulo')));

        $manager =  $doctrine->getManager();        
        $manager->flush();

        return $this->json(['data' => 'esporte atualizado com sucesso!']);
    }



    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     */
    public function delete($id)
    {
        $doctrine = $this->getDoctrine();
        $sport = $doctrine->getRepository(Sport::class)->find($id);

        $manager =  $doctrine->getManager(); 
        $manager->remove($sport);       
        $manager->flush();

        return $this->json(['data' => 'esporte deletado com sucesso!']);
    }
}
