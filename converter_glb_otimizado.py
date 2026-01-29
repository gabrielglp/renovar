#!/usr/bin/env python3
"""
Script para converter OBJ para GLB com COMPRESSÃO DRACO MÁXIMA
Reduz arquivos de 40-50 MB para 1-3 MB (até 95% de redução!)
"""

import os
import subprocess
import sys

def check_gltf_pipeline():
    """Verifica se gltf-pipeline está instalado"""
    try:
        result = subprocess.run(['gltf-pipeline', '--version'], 
                              capture_output=True, text=True, check=True)
        print(f"✅ gltf-pipeline encontrado: {result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ gltf-pipeline não encontrado!")
        print("\n📦 Instale com:")
        print("   npm install -g gltf-pipeline")
        print("\nOu via npx (sem instalar):")
        print("   Use o comando npx gltf-pipeline ao invés de gltf-pipeline")
        return False

def convert_obj_to_glb(obj_file, output_file=None):
    """
    Converte OBJ para GLB com compressão Draco MÁXIMA
    
    Args:
        obj_file: Caminho para arquivo .obj
        output_file: Caminho para arquivo .glb de saída (opcional)
    """
    if not os.path.exists(obj_file):
        print(f"❌ Arquivo não encontrado: {obj_file}")
        return False
    
    # Se não especificar output, usar mesmo nome com .glb
    if output_file is None:
        output_file = obj_file.replace('.obj', '_compressed.glb')
    
    print(f"\n🔄 Convertendo: {obj_file}")
    print(f"   Destino: {output_file}")
    
    # Primeiro converter OBJ -> GLTF usando obj2gltf (se disponível)
    temp_gltf = obj_file.replace('.obj', '_temp.gltf')
    
    try:
        # Tentar usar obj2gltf se disponível
        subprocess.run([
            'npx', 'obj2gltf',
            '-i', obj_file,
            '-o', temp_gltf
        ], check=True, capture_output=True)
        print("   ✅ Convertido para GLTF")
        
        # Agora comprimir GLTF -> GLB com Draco MÁXIMO
        subprocess.run([
            'gltf-pipeline',
            '-i', temp_gltf,
            '-o', output_file,
            '--draco.compressionLevel=10',  # MÁXIMO (0-10)
            '--draco.quantizePositionBits=11',  # Quantização agressiva
            '--draco.quantizeNormalBits=8',
            '--draco.quantizeTexcoordBits=8',
            '--draco.quantizeColorBits=8',
            '--draco.quantizeGenericBits=8',
            '--draco.unifiedQuantization'
        ], check=True, capture_output=True)
        
        # Remover arquivo temporário
        if os.path.exists(temp_gltf):
            os.remove(temp_gltf)
        
        # Mostrar estatísticas
        original_size = os.path.getsize(obj_file) / (1024 * 1024)  # MB
        compressed_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
        reduction = ((original_size - compressed_size) / original_size) * 100
        
        print(f"   📊 Tamanho original: {original_size:.2f} MB")
        print(f"   📊 Tamanho comprimido: {compressed_size:.2f} MB")
        print(f"   ✅ Redução: {reduction:.1f}%")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Erro na conversão: {e}")
        # Limpar arquivo temporário se houver erro
        if os.path.exists(temp_gltf):
            os.remove(temp_gltf)
        return False
    except FileNotFoundError:
        print("   ❌ obj2gltf não encontrado!")
        print("   📦 Instale com: npm install -g obj2gltf")
        return False

def main():
    print("=" * 60)
    print("🚀 CONVERSOR OBJ -> GLB COM COMPRESSÃO DRACO MÁXIMA")
    print("=" * 60)
    
    # Verificar se gltf-pipeline está instalado
    if not check_gltf_pipeline():
        sys.exit(1)
    
    # Arquivos para converter
    files = ['base.obj', 'escova.obj', 'fio_dental.obj']
    
    print(f"\n📋 Encontrados {len(files)} arquivos para converter:")
    for f in files:
        if os.path.exists(f):
            size_mb = os.path.getsize(f) / (1024 * 1024)
            print(f"   ✅ {f} ({size_mb:.2f} MB)")
        else:
            print(f"   ⚠️  {f} (não encontrado)")
    
    # Converter cada arquivo
    success_count = 0
    for obj_file in files:
        if os.path.exists(obj_file):
            # Sobrescrever o .glb existente
            output_file = obj_file.replace('.obj', '.glb')
            if convert_obj_to_glb(obj_file, output_file):
                success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Conversão completa: {success_count}/{len(files)} arquivos")
    print("=" * 60)
    print("\n💡 Próximos passos:")
    print("   1. Atualize a página (Ctrl+Shift+R para limpar cache)")
    print("   2. Os arquivos agora devem carregar 10-30x mais rápido!")
    print("   3. Espere arquivos de 1-3 MB ao invés de 12-15 MB")

if __name__ == '__main__':
    main()






